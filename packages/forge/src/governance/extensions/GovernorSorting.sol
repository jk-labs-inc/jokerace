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
    //          without taking out deleted proposals) within the limit that are deleted and do not have other, non-deleted proposals
    //          with the same amounts of votes/that are tied with them.
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
    // TODO: make RANK_LIMIT configurable + test ranges
    // TODO: flesh out tests a ton for different edge cases w oldValue, smallest sorted ranks value, and RANK_LIMIT overlaps
    
    // RULE: cannot be 0
    uint256 public constant RANK_LIMIT = 250;

    // RULE: array length can never end lower than it started a transaction, otherwise erroneous ranking can happen
    uint256[] public sortedRanks; // value is forVotes counts, has the constraint of no duplicate values.

    /**
     * @dev Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view virtual returns (uint256 count);

    /**
     * @dev Get the sortedRanks array.
     */
    function getSortedRanks() public view virtual returns (uint256[] memory sortedRanksArray) {
        return sortedRanks;
    }

    // get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account.
    // a rank has to have > 0 votes to be considered valid.
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        require(rank != 0, "GovernorSorting: rank cannot equal 0");

        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        uint256 counter = 1;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
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
        if (idx > sortedRanks.length - 1) {
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
    //      -not tied
    //      -the idx where it should go is in [0, sortedRanks.length - 1]
    function _insertRank(
        uint256 oldValue,
        uint256 newValue,
        uint256 sortedRanksLength,
        uint256[] memory sortedRanksMemVar
    ) internal {
        // find the index to insert newValue at
        uint256 insertingIndex;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
            if (newValue > sortedRanksMemVar[index]) {
                insertingIndex = index;
                break;
            }
        }

        // what we care about accounting for below is oldValue and the items at + below insertingIndex - we need to make sure all cases are accounted for:
        //      - oldValue is at insertingIndex
        //      - oldValue is at sortedRanks.length - 1
        //      - oldValue is between (exclusive) insertingIndex and last value (oldValue !> insertingIndex bc no downvoting)
        //      - insertingIndex == sortedRanks.length - 1
        //      - sortedRanks.length == RANK_LIMIT
        //      - and the above 2 cases if we aren't looking for oldValue too (if it's tied or it was 0 to begin with)
        //      - and all of the ranges that insertingIndex ([0, sortedRanks.length - 1]), sortedRanks.length - 1 ([0, RANK_LIMIT - 1]), and oldValue ([insertingIndex, sortedRanks.length - 1]) could be

        // are we checking for the oldValue?
        bool checkForOldValue = (oldValue > 0) && (getNumProposalsWithThisManyForVotes(oldValue) == 0); // if there are props left with oldValue votes, we don't want to remove it
        bool haveFoundOldValue = false;

        // DO ANY SHIFTING? - not if we're checking for it and oldValue is at insertingIndex, then we're good, we don't need to update anything besides insertingIndex.
        if (!(checkForOldValue && (sortedRanksMemVar[insertingIndex] == oldValue))) {
            // DO SHIFTING FROM (insertingIndex, sortedRanksLength)?
            //      - if insertingIndex == sortedRanksLength - 1, then there's nothing after it to shift down.
            //      - also if this is the case + oldValue's not at insertingIndex, then don't need to worry about oldValue bc it's not in the array.
            if (!(insertingIndex == sortedRanksLength - 1)) {
                // SHIFT UNTIL/IF YOU FIND OLD VALUE IN THE RANGE (insertingIndex, sortedRanksLength) - go through and shift everything down until/if we hit oldValue.
                // if we hit the limit then the last item will just be dropped).
                for (uint256 index = insertingIndex + 1; index < sortedRanksLength; index++) {
                    sortedRanks[index] = sortedRanksMemVar[index - 1];

                    // STOP ONCE YOU FIND OLD VALUE - if I'm looking for it, once I shift a value into the index oldValue was in (if it's in here) I can stop!
                    if (checkForOldValue && (sortedRanksMemVar[index] == oldValue)) {
                        haveFoundOldValue = true;
                        break;
                    }
                }
            }

            // SHIFT INTO NEW INDEX? - if we didn't run into oldValue and we wouldn't be trying to shift into index RANK_LIMIT, then
            // go ahead and shift what was in sortedRanksLength - 1 into the next idx
            if (!haveFoundOldValue && (sortedRanksLength < RANK_LIMIT)) {
                sortedRanks.push(sortedRanksMemVar[sortedRanksLength - 1]);
            }
        }

        // SET INSERTING IDX - now that everything's been accounted for, let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;
    }

    // keep things sorted as we go.
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas.
    function _updateRanks(uint256 oldValue, uint256 newValue) internal {
        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // FIRST ENTRY? - if this is the first item ever then we just need to put it in idx 0 and that's it
        if (sortedRanksLength == 0) {
            sortedRanks.push(newValue);
            return;
        }

        // TIED?
        if (getNumProposalsWithThisManyForVotes(newValue) > 1) {
            // we don't need to insert anything, so we just need to treat these cases of oldValues that get
            // left behind like deletes (these are the TTs mentioned at the top) because of the array rule.
            return;
        }

        // SMALLER THAN CURRENT SMALLEST VAL?
        // this also means that the old value was 0 (or less than the lowest value if sortedRanks.length == RANK_LIMIT and/or the array is full), so all good with regards to oldValue.
        if (newValue < sortedRanksMemVar[sortedRanksLength - 1]) {
            if (sortedRanksLength == RANK_LIMIT) {
                // if we've reached the size limit of sortedRanks, then we're done here
                return;
            } else {
                // otherwise, put this value in the index after the current smallest value
                sortedRanks.push(newValue);
                return;
            }
        }

        // SO IT'S IN [0, smallestValue]!
        // find where it should go and insert it.
        _insertRank(oldValue, newValue, sortedRanksLength, sortedRanksMemVar);
    }
}
