// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./GovernorCountingSimple.sol";

/**
 * @dev Extension of {GovernorCountingSimple} for sorting and ranking.
 *
 * _Available since v4.3._
 */
abstract contract GovernorSorting is GovernorCountingSimple {
    bool public setSortedAndTiedProposalsHasBeenRun = false;
    mapping(uint256 => uint256) public tiedAdjustedRankingPosition; // key is ranking, value is index of the last iteration of that ranking's value in the _sortedProposalIds array taking ties into account

    mapping(uint256 => bool) private _isTied; // whether a ranking is tied. key is ranking.
    uint256[] private _sortedProposalIds;
    uint256 private _lowestRanking; // worst ranking (1 is the best possible ranking, 8 is a lower/worse ranking than 1)
    uint256 private _highestTiedRanking; // best (1 is better than 8) ranking that is tied

    /**
     * @dev Getter if a given ranking is tied.
     */
    function isTied(uint256 ranking) public view returns (bool) {
        require(
            setSortedAndTiedProposalsHasBeenRun, "RewardsModule: run setSortedAndTiedProposals() to populate this value"
        );
        return _isTied[ranking];
    }

    /**
     * @dev Getter for tiedAdjustedRankingPosition of a ranking.
     */
    function rankingPosition(uint256 ranking) public view returns (uint256) {
        require(
            setSortedAndTiedProposalsHasBeenRun, "RewardsModule: run setSortedAndTiedProposals() to populate this value"
        );
        return tiedAdjustedRankingPosition[ranking];
    }

    /**
     * @dev Getter for _sortedProposalIds.
     */
    function sortedProposalIds() public view returns (uint256[] memory) {
        require(
            setSortedAndTiedProposalsHasBeenRun, "RewardsModule: run setSortedAndTiedProposals() to populate this value"
        );
        return _sortedProposalIds;
    }

    /**
     * @dev Getter for the lowest ranking.
     */
    function lowestRanking() public view returns (uint256) {
        require(
            setSortedAndTiedProposalsHasBeenRun, "RewardsModule: run setSortedAndTiedProposals() to populate this value"
        );
        return _lowestRanking;
    }

    /**
     * @dev Getter for highest tied ranking.
     */
    function highestTiedRanking() public view returns (uint256) {
        require(
            setSortedAndTiedProposalsHasBeenRun, "RewardsModule: run setSortedAndTiedProposals() to populate this value"
        );
        return _highestTiedRanking;
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function allProposalTotalVotes()
        public
        view
        virtual
        returns (uint256[] memory proposalIdsReturn, VoteCounts[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIds = getAllProposalIds();
        VoteCounts[] memory proposalVoteCountsArray = new VoteCounts[](proposalIds.length);
        for (uint256 i = 0; i < proposalIds.length; i++) {
            proposalVoteCountsArray[i] = proposalVotesStructs[proposalIds[i]].proposalVoteCounts;
        }
        return (proposalIds, proposalVoteCountsArray);
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal that excludes deleted proposals.
     */
    function allProposalTotalVotesWithoutDeleted()
        public
        view
        virtual
        returns (uint256[] memory proposalIdsReturn, VoteCounts[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIds = getAllProposalIds();
        uint256[] memory proposalIdsWithoutDeleted = new uint256[](proposalIds.length);
        VoteCounts[] memory proposalVoteCountsArray = new VoteCounts[](proposalIds.length);

        uint256 newArraysIndexCounter = 0;
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (!(isProposalDeleted(proposalIds[i]) == 1)) {
                proposalIdsWithoutDeleted[newArraysIndexCounter] = proposalIds[i];
                proposalVoteCountsArray[newArraysIndexCounter] = proposalVotesStructs[proposalIds[i]].proposalVoteCounts;
                newArraysIndexCounter += 1;
            }
        }
        return (proposalIdsWithoutDeleted, proposalVoteCountsArray);
    }

    function _sortItem(uint256 pos, int256[] memory netProposalVotes, uint256[] memory proposalIds)
        internal
        pure
        returns (bool)
    {
        uint256 wMin = pos;
        for (uint256 i = pos; i < netProposalVotes.length; i++) {
            if (netProposalVotes[i] < netProposalVotes[wMin]) {
                wMin = i;
            }
        }
        if (wMin == pos) return false;
        int256 votesTmp = netProposalVotes[pos];
        netProposalVotes[pos] = netProposalVotes[wMin];
        netProposalVotes[wMin] = votesTmp;
        uint256 proposalIdsTmp = proposalIds[pos];
        proposalIds[pos] = proposalIds[wMin];
        proposalIds[wMin] = proposalIdsTmp;
        return true;
    }

    /**
     * @dev Accessor to sorted list of proposalIds in ascending order.
     */
    function sortedProposals(bool excludeDeletedProposals)
        public
        view
        virtual
        returns (uint256[] memory sortedProposalIdsReturn)
    {
        (uint256[] memory proposalIdList, VoteCounts[] memory proposalVoteCountsArray) =
            excludeDeletedProposals ? allProposalTotalVotesWithoutDeleted() : allProposalTotalVotes();
        int256[] memory netProposalVotes = new int256[](proposalIdList.length);
        for (uint256 i = 0; i < proposalVoteCountsArray.length; i++) {
            netProposalVotes[i] =
                int256(proposalVoteCountsArray[i].forVotes) - int256(proposalVoteCountsArray[i].againstVotes);
        }
        for (uint256 i = 0; i < proposalIdList.length - 1; i++) {
            // Only goes to length minus 1 because sorting the last item would be redundant
            _sortItem(i, netProposalVotes, proposalIdList);
        }
        return proposalIdList;
    }

    /**
     * @dev Setter for _sortedProposalIds, tiedAdjustedRankingPosition, _isTied, _lowestRanking,
     * and _highestTiedRanking. Will only be called once and only needs to be called once because once the contest
     * is complete these values don't change. Determines if a ranking is tied and also where the last
     * iteration of a ranking is in the _sortedProposalIds list taking ties into account.
     */
    function setSortedAndTiedProposals() public virtual {
        require(
            state() == IGovernor.ContestState.Completed,
            "GovernorSorting: contest must be to calculate sorted and tied proposals"
        );
        require(
            setSortedAndTiedProposalsHasBeenRun == false,
            "GovernorSorting: setSortedAndTiedProposals() has already been run and its respective values set"
        );

        _sortedProposalIds = sortedProposals(true);

        int256 lastTotalVotes;
        uint256 rankingBeingChecked = 1;
        _highestTiedRanking = _sortedProposalIds.length + 1; // set as default so that it isn't 0 if no ties are found
        for (uint256 i = 0; i < _sortedProposalIds.length; i++) {
            uint256 lastSortedItemIndex = _sortedProposalIds.length - 1;

            // decrement through the ascending sorted list
            (uint256 currentForVotes, uint256 currentAgainstVotes) =
                proposalVotes(_sortedProposalIds[lastSortedItemIndex - i]);
            int256 currentTotalVotes = int256(currentForVotes) - int256(currentAgainstVotes);

            // if on first item, set lastTotalVotes and continue
            if (i == 0) {
                lastTotalVotes = currentTotalVotes;

                // if on last item, then the value at the current index is
                // the last iteration of the last ranking's value
                if (i + 1 == _sortedProposalIds.length) {
                    tiedAdjustedRankingPosition[rankingBeingChecked] = lastSortedItemIndex - i;
                    _lowestRanking = rankingBeingChecked;
                }

                continue;
            }

            // if there is a tie, mark that this ranking is tied
            if (currentTotalVotes == lastTotalVotes) {
                if (!_isTied[rankingBeingChecked]) {
                    // if this is not already set
                    _isTied[rankingBeingChecked] = true;
                }
                if (_highestTiedRanking == _sortedProposalIds.length + 1) {
                    // if this is the first tie found, set it as the highest tied ranking
                    _highestTiedRanking = rankingBeingChecked;
                }
            }
            // otherwise, mark that the last iteration of this ranking's value is at the index
            // above the current index in the sorted list, then increment the ranking being checked
            if (currentTotalVotes != lastTotalVotes) {
                // index we last decremented from is the last iteration of the current rank's value
                tiedAdjustedRankingPosition[rankingBeingChecked] = lastSortedItemIndex - i + 1;
                rankingBeingChecked++;
            }

            // if on last item, then the value at the current index is the last iteration of the last ranking's value
            if (i + 1 == _sortedProposalIds.length) {
                tiedAdjustedRankingPosition[rankingBeingChecked] = lastSortedItemIndex - i;
                _lowestRanking = rankingBeingChecked;
            }

            lastTotalVotes = currentTotalVotes;
        }

        setSortedAndTiedProposalsHasBeenRun = true;
    }
}
