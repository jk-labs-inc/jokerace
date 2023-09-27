// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Logic for sorting and ranking.
 *
 * _Available since v4.3._
 */
abstract contract GovernorSorting {

    // WE KEEP TRACK OF TIES (if > 1) AS WELL AS DELETES (if == 0) W forVotesToProposalId

    uint256 public constant RANK_LIMIT = 25; // cannot be 0

    uint256[] public sortedRanks = new uint256[](RANK_LIMIT); // value is forVotes counts
    uint256 public smallestNonZeroSortedRanksValueIdx = 0; // the index of the smallest non-zero value in sortedRanks, useful to finding where sortedRanks has been populated to

    /**
     * @dev Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view virtual returns (uint256 count);

    // get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account
    // a rank has to have > 0 votes to be considered valid
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        require(rank != 0, "GovernorSorting: rank cannot equal 0");
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
        // (how you would get here is it you deleted the top 25 voted proposals with a RANK_LIMIT of 25
        // and then tried to pay out rank 1, or any rank for that matter; or just don't have enough proposals with forVotes on them
        // to get to this rank)
        revert(
            "GovernorSorting: this rank does not exist or is out of the allowed rank tracking range taking deleted proposals into account"
        );
    }

    // returns whether a given index in sortedRanks is tied or is below a tied rank
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > smallestNonZeroSortedRanksValueIdx) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert("GovernorSorting: this index or one above it has not been populated");
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyForVotes(index) > 1) {
                return true;
            }
        }
        return false;
    }

    // insert a new value into sortedRanks at insertingIndex
    // we know at this point that insertingIndex is before smallestNonZeroSortedRanksValueIdx
    function _insertRank(uint256 oldValue, uint256 newValue, uint256 insertingIndex) internal {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // go through and shift the value of `insertingIndex` and everything under it (until we hit oldValue, if we do) down one in sortedRanks
        bool checkForOldValue = (oldValue > 0) && (getNumProposalsWithThisManyForVotes(oldValue) == 0); // if there are other props with oldValue, we don't want to be removing it
        bool hitOldValue = false;
        uint256 tmp1 = sortedRanksMemVar[insertingIndex];
        uint256 tmp2;
        for (uint256 index = insertingIndex + 1; index < RANK_LIMIT; index++) {
            tmp2 = sortedRanksMemVar[index];
            sortedRanks[index] = tmp1;
            tmp1 = tmp2;

            // once I shift a value into the index oldValue was in (if it's in here) I can stop!
            if (checkForOldValue && (tmp1 == oldValue)) {
                hitOldValue = true; // if I hit oldValue, smallestNonZeroSortedRanksValueIdx should not be incremented
                break;
            }

            if (index == smallestIdxMemVar + 1) {
                // if I've populated this index, then everything after will just be 0s, which I can skip
                break;
            }
        }

        // now that everything's been swapped out and sortedRanks[insertingIndex] == sortedRanks[insertingIndex + 1], let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;

        if (!hitOldValue && (smallestIdxMemVar + 1 != RANK_LIMIT)) {
            // if smallestNonZeroSortedRanksValueIdx isn't already at the limit, bump it one
            smallestNonZeroSortedRanksValueIdx++;
        }
    }

    // keep things sorted as we go
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas
    function _updateRanks(uint256 oldValue, uint256 newValue) internal {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // TIED? - are there other props that already have newValue forVotes and so this one is now tied?
        // if so, no need to insert anything, we just need to remove oldVotes
        if (getNumProposalsWithThisManyForVotes(newValue) > 1) {
            // TODO: add function to rm/shift to the left oldValue + decrement smallestNonZeroSortedRanksValueIdx - start at smallestIdxMemVar
            return;
        }

        // SMALLER THAN CURRENT SMALLEST NON-ZERO VAL? - is it after smallestNonZeroSortedRanksValueIdx?
        // is the current proposal's forVotes less than that of the currently lowest value element in the sorted
        // array? if so, just insert it after it. if that index would be RANK_LIMIT, then we're done.
        // this also means that the old value was 0 or less than that at smallestNonZeroSortedRanksValueIdx so all good there.
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
        // find the index that newValue is larger than or equal to.
        // working right to left starting with the smallestNonZeroSortedRanksValueIdx - 1 bc of above logic.
        uint256 indexToInsertAt;
        for (uint256 index = 0; index < smallestIdxMemVar; index++) {
            if (newValue > sortedRanksMemVar[smallestIdxMemVar - 1 - index]) {
                // then this is the index that the new value should be inserted at
                indexToInsertAt = smallestIdxMemVar - 1 - index;
                break;
            }
        }

        // insert it there, pushing everything behind it down and removing oldValue unless there is still at least 1 prop at it
        _insertRank(oldValue, newValue, indexToInsertAt);
    }
}
