// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Logic for sorting and ranking.
 */
abstract contract GovernorSorting {
    // Because of the array rule below, the actual number of rankings that this contract will be able to track is determined by three things:
    //      - RANK_LIMIT
    //      - Woulda Beens (WBs)
    //          The number of would-be ranked proposals (at the end of the contest if rankings were counted
    //          without taking out deleted proposals) within the limit that are deleted that are not tied.
    //      - To Tied (TTs)
    //          The number of times a proposal is voted into a ranking to tie it or a ranking that is already tied
    //          from a ranking that was in the tracked rankings at the time that vote was cast.
    //
    // The equation to calcluate how many rankings this contract will actually be able to track is:
    // # of rankings GovernorSorting can track for a given contest = RANK_LIMIT - WBs - TTs
    //
    // With this in mind, it is strongly reccomended to set RANK_LIMIT sufficiently high to create a buffer for
    // WBs and TTs that may occur in your contest. The thing to consider with regard to making it too high is just
    // that it is more gas for users on average the higher that RANK_LIMIT is set.

    // TODO: add option to disable rank tracking for gas savings
    // TODO: make configurable + test ranges
    uint256 public constant RANK_LIMIT = 250; // cannot be 0

    // RULE: array length can never end lower than it started a transaction, otherwise erroneous ranking can happen
    uint256[] public sortedRanks = new uint256[](RANK_LIMIT); // value is forVotes counts
    uint256 public smallestNonZeroSortedRanksValueIdx = 0; // the index of the smallest non-zero value in sortedRanks, useful to finding where sortedRanks has been populated to

    /**
     * @dev Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view virtual returns (uint256 count);

    // get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account.
    // a rank has to have > 0 votes to be considered valid.
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        require(rank != 0, "GovernorSorting: rank cannot equal 0");

        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        uint256 counter = 1;
        for (uint256 index = 0; index < smallestIdxMemVar + 1; index++) {
            // if this is a deleted proposal, go forwards without incrementing the counter
            if (getNumProposalsWithThisManyForVotes(sortedRanksMemVar[index]) == 0) {
                continue;
            }
            // if the counter is at the rank we are looking for, then return with it
            if (counter == rank) {
                return index;
            }
            counter++;
        }

        // if there's no valid index for that rank in sortedRanks, revert
        revert(
            "GovernorSorting: this rank does not exist or is out of the allowed rank tracking range taking deleted proposals + TTs into account"
        );
    }

    // returns whether a given index in sortedRanks is tied or is below a tied rank
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > smallestNonZeroSortedRanksValueIdx) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert("GovernorSorting: this index has not been populated");
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyForVotes(sortedRanks[index]) > 1) {
                return true;
            }
        }
        return false;
    }

    // insert a new value into sortedRanks (this function is strictly O(n)).
    // we know at this point it's:
    //      -in [0, smallestNonZeroSortedRanksValueIdx) (exclusive on the end bc it's not tied and it's not less than)
    //      -not tied
    function _insertRank(
        uint256 oldValue,
        uint256 newValue,
        uint256 smallestIdxMemVar,
        uint256[] memory sortedRanksMemVar
    ) internal {
        // find the index to insert newValue at
        uint256 insertingIndex;
        for (uint256 index = 0; index < smallestIdxMemVar; index++) {
            if (newValue > sortedRanksMemVar[index]) {
                insertingIndex = index;
                break;
            }
        }

        // go through and shift the value of `insertingIndex` and everything under it (until we hit oldValue, if we do) down one in sortedRanks
        // (if we hit the limit then the last item will just be dropped)
        bool checkForOldValue = (oldValue > 0) && (getNumProposalsWithThisManyForVotes(oldValue) == 0); // if there are props left with oldValue votes, we don't want to remove it
        bool haveHitOldValue = false;

        // if we're checking for oldValue, check for if is at insertingIndex
        if (checkForOldValue && (sortedRanksMemVar[insertingIndex] == oldValue)) {
            haveHitOldValue = true;
        }

        // if that's not the case, then go through and shift everything down until/if we hit oldValue
        if (!haveHitOldValue) {
            for (uint256 index = insertingIndex + 1; index < RANK_LIMIT; index++) {
                // account for if the index of oldValue is at insertingIndex
                sortedRanks[index] = sortedRanksMemVar[index - 1];

                // once I shift a value into the index oldValue was in (if it's in here) I can stop!
                if (checkForOldValue && (sortedRanksMemVar[index] == oldValue)) {
                    haveHitOldValue = true; // if I hit oldValue, smallestNonZeroSortedRanksValueIdx should not be incremented
                    break;
                }

                if (index == smallestIdxMemVar + 1) {
                    // if I've populated this index, everything after will just be 0s, which I can skip
                    break;
                }
            }
        }

        // now that everything's been shifted down and sortedRanks[insertingIndex] == sortedRanks[insertingIndex + 1], let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;

        if (!haveHitOldValue && (smallestIdxMemVar + 1 != RANK_LIMIT)) {
            // if smallestNonZeroSortedRanksValueIdx isn't already at the limit, bump it one
            smallestNonZeroSortedRanksValueIdx++;
        }
    }

    // TODO: lay out all of the cases with this/its inputs + constraints (old and new value will never be the same for example)
    // keep things sorted as we go.
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas.
    function _updateRanks(uint256 oldValue, uint256 newValue) internal {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // TIED?
        if (getNumProposalsWithThisManyForVotes(newValue) > 1) {
            // we don't need to insert anything, so we just need to treat these cases of oldValues that get
            // left behind like deletes (these are the TTs mentioned at the top) because of the array rule.
            return;
        }

        // SMALLER THAN CURRENT SMALLEST NON-ZERO VAL? - is it after smallestNonZeroSortedRanksValueIdx?
        // this also means that the old value was 0 or less than that so all good there.
        if (newValue < sortedRanksMemVar[smallestIdxMemVar]) {
            if (smallestIdxMemVar + 1 == RANK_LIMIT) {
                // if we've reached the size limit of sortedRanks, then we're done here
                return;
            } else {
                // otherwise, put this value in the index after the current smallest value and increment
                // smallestNonZeroSortedRanksValueIdx to reflect the updated state
                sortedRanks[smallestIdxMemVar + 1] = newValue;
                smallestNonZeroSortedRanksValueIdx++;
                return;
            }
        }

        // SO IT'S IN [0, smallestNonZeroSortedRanksValueIdx) (exclusive on the end bc it's not tied and it's not less than)
        // find where it should go and insert it.
        _insertRank(oldValue, newValue, smallestIdxMemVar, sortedRanksMemVar);
    }
}
