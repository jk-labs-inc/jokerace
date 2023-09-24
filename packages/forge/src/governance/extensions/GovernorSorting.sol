// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Extension of {GovernorCountingSimple} for sorting and ranking.
 *
 * _Available since v4.3._
 */
abstract contract GovernorSorting {
    // TODO: implement usage in RewardsModule (proposalId -> forVotes -> ranking, maybe a forVotes -> proposalId map too which could be helpful to go ranking -> proposalId)

    uint256 public constant RANK_LIMIT = 25;

    uint256[] public sortedRanks = new uint256[](RANK_LIMIT); // value is forVotes counts
    mapping(uint256 => uint256) public copyCounts; // key is forVotes amount, value is the number of copies of that number that are present in sortedRanks

    // keep things sorted as we go
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas
    function updateRanks(uint256 oldProposalForVotes, uint256 proposalForVotes) public {
        // 1. decrement the count of the position of oldProposalForVotes
        if (copyCounts[oldProposalForVotes] > 1) {
            copyCounts[oldProposalForVotes]--;
        }

        // 2. is the current proposal's forVotes less than that of the last element in the sorted
        // array? if so, then we're done here.
        if (proposalForVotes < sortedRanks[sortedRanks.length - 1]) {
            return;
        }

        // 3. find where it should go - find the index that it is larger than or equal to
        uint256 indexToInsertAt;
        for (uint256 index = 0; index < RANK_LIMIT; index++) {
            uint256 valueToCheck = sortedRanks[index];

            // in the case of a tie
            if (proposalForVotes == valueToCheck) {
                // increment the copy count and return, nothing more to do
                copyCounts[valueToCheck]++;
                return;
            }

            if (proposalForVotes > valueToCheck) {
                // then this is the index that the new value should be inserted at
                indexToInsertAt = index;
                break;
            }

            // if we reach the end of the array without finding a value that proposalForVotes
            // is greater than or equal to, then our work here is done
            if (index == RANK_LIMIT - 1) {
                return;
            }
        }

        // TODO: implement this function
        // 3. insert it there, pushing everything behind it down
        // insert(index) -> make a tmp array of what everything under that index should be (what that index was -> the 2nd to last item) -> go through and change the values of `index` and everything under it   
    }
}
