// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (governance/extensions/GovernorCountingSimple.sol)

pragma solidity ^0.8.0;

import "../Governor.sol";

/**
 * @dev Extension of {Governor} for simple, 3 options, vote counting.
 *
 * _Available since v4.3._
 */
abstract contract GovernorCountingSimple is Governor {
    /**
     * @dev Supported vote types. Matches Governor Bravo ordering.
     */
    enum VoteType {
        For,
        Against
    }

    struct VoteCounts {
        uint256 forVotes;
        uint256 againstVotes;
    }

    struct ProposalVote {
        VoteCounts proposalVoteCounts;
        address[] addressesVoted;
        mapping(address => VoteCounts) addressVoteCounts;
    }

    mapping(address => uint256) private _addressTotalCastVoteCounts;
    mapping(uint256 => ProposalVote) private _proposalVotes;

    /**
     * @dev See {IGovernor-COUNTING_MODE}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function COUNTING_MODE() public pure virtual override returns (string memory) {
        return "support=bravo&quorum=for";
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function proposalVotes(uint256 proposalId) public view virtual returns (uint256 forVotes, uint256 againstVotes) {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (proposalvote.proposalVoteCounts.forVotes, proposalvote.proposalVoteCounts.againstVotes);
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
            proposalVoteCountsArray[i] = _proposalVotes[proposalIds[i]].proposalVoteCounts;
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
                proposalVoteCountsArray[newArraysIndexCounter] = _proposalVotes[proposalIds[i]].proposalVoteCounts;
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
     * @dev Accessor to how many votes an address has cast total for the contest so far.
     */
    function contestAddressTotalVotesCast(address userAddress) public view virtual returns (uint256 totalVotesCast) {
        return (_addressTotalCastVoteCounts[userAddress]);
    }

    /**
     * @dev Accessor to how many votes an address has cast for a given proposal.
     */
    function proposalAddressVotes(uint256 proposalId, address userAddress)
        public
        view
        virtual
        returns (uint256 forVotes, uint256 againstVotes)
    {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (
            proposalvote.addressVoteCounts[userAddress].forVotes,
            proposalvote.addressVoteCounts[userAddress].againstVotes
        );
    }

    /**
     * @dev Accessor to which addresses have cast a vote for a given proposal.
     */
    function proposalAddressesHaveVoted(uint256 proposalId) public view virtual returns (address[] memory) {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (proposalvote.addressesVoted);
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).
     */
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, uint256 totalVotes)
        internal
        virtual
        override
    {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];

        require(
            numVotes <= (totalVotes - _addressTotalCastVoteCounts[account]),
            "GovernorVotingSimple: not enough votes left to cast"
        );

        bool firstTimeVoting = proposalvote.addressVoteCounts[account].forVotes == 0;

        if (support == uint8(VoteType.For)) {
            proposalvote.proposalVoteCounts.forVotes += numVotes;
            proposalvote.addressVoteCounts[account].forVotes += numVotes;
        } else if (support == uint8(VoteType.Against)) {
            require(downvotingAllowed() == 1, "GovernorVotingSimple: downvoting is not enabled for this Contest");
            proposalvote.proposalVoteCounts.againstVotes += numVotes;
            proposalvote.addressVoteCounts[account].againstVotes += numVotes;
        } else {
            revert("GovernorVotingSimple: invalid value for enum VoteType");
        }

        if (firstTimeVoting) {
            proposalvote.addressesVoted.push(account);
        }
        _addressTotalCastVoteCounts[account] += numVotes;
    }
}
