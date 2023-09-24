// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Extension of {GovernorCountingSimple} for sorting and ranking.
 *
 * _Available since v4.3._
 */
abstract contract GovernorSorting {
    uint256 public constant RANK_LIMIT = 25; // cannot be 0

    uint256[] public sortedRanks = new uint256[](RANK_LIMIT); // value is forVotes counts
    mapping(uint256 => uint256) public copyCounts; // key is forVotes amount, value is the number of copies of that number that are present in sortedRanks

    // get the idx of sortedRanks considered to be the inputted rank taking deleted proposals
    // into account
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        require(rank != 0, "GovernorSorting: rank cannot equal 0");
        uint256 counter = 1;
        for (uint256 index = 0; index < sortedRanks.length; index++) {
            // if this is a deleted proposal, go forwards without incrementing the counter
            if (copyCounts[sortedRanks[index]] > 1) {
                continue;
            }
            // if the counter is at the rank we are looking for, then return with it
            if (counter == rank) {
                return index;
            }
            counter++;
        }
    }

    // returns whether a given index in sortedRanks is tied or is below a tied rank
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        for (uint256 index = 0; index < idx + 1; index++) {
            if (copyCounts[index] > 1) {
                return true;
            }
        }
        return false;
    }

    // insert a new value into sortedRanks at insertingIndex
    function _insertRank(uint256 newValue, uint256 insertingIndex) internal {
        // if either of these cases, then we can just swap out, there is nothing to push down
        if ((insertingIndex == RANK_LIMIT) || RANK_LIMIT == 1) {
            sortedRanks[insertingIndex] = newValue;
        }

        // if we do need to push things down, make a tmp array of what everything at and
        // under that index should be (what that index was -> through the last item)
        uint256 tmpArrayLen = RANK_LIMIT - insertingIndex;
        uint256[] memory tmp = new uint256[](tmpArrayLen);
        for (uint256 index = 0; index < tmpArrayLen; index++) {
            tmp[index] = sortedRanks[insertingIndex + index];
        }

        // go through and change the values of `index` and everything under it in sortedRanks
        // NOTE: if sortedRanks is full, the last item of sortedRanks will not be used because
        // it gets dropped off of the array
        for (uint256 index = insertingIndex + 1; index < RANK_LIMIT; index++) {
            sortedRanks[index] = tmp[index - (insertingIndex + 1)];
        }

        // now that everything's been swapped out and sortedRanks[insertingIndex] == sortedRanks[insertingIndex + 1], let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;
    }

    // keep things sorted as we go
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas
    function updateRanks(uint256 oldProposalForVotes, uint256 newProposalForVotes) public {
        // 1. decrement the count of the position of oldProposalForVotes
        if (copyCounts[oldProposalForVotes] > 1) {
            copyCounts[oldProposalForVotes]--;
        }

        // 2. is the current proposal's forVotes less than that of the last element in the sorted
        // array? if so, then we're done here.
        if (newProposalForVotes < sortedRanks[sortedRanks.length - 1]) {
            return;
        }

        // 3. find where it should go - find the index that newProposalForVotes is larger than or equal to
        uint256 indexToInsertAt;
        for (uint256 index = 0; index < RANK_LIMIT; index++) {
            uint256 valueToCheck = sortedRanks[index];

            // in the case of a tie
            if (newProposalForVotes == valueToCheck) {
                // increment the copy count and return, nothing more to do
                copyCounts[valueToCheck]++;
                return;
            }

            if (newProposalForVotes > valueToCheck) {
                // then this is the index that the new value should be inserted at
                indexToInsertAt = index;
                break;
            }

            // if we reach the end of the array without finding a value that proposalForVotes
            // is greater than or equal to, then our work here is done, we don't need to include in
            // the array
            if (index == RANK_LIMIT - 1) {
                return;
            }
        }

        // 4. insert it there, pushing everything behind it down
        _insertRank(newProposalForVotes, indexToInsertAt);
    }
}
