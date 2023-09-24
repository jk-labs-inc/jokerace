// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";
import "../../utils/BokkyPooBahsRedBlackTreeRaw.sol";

/**
 * @dev Extension of {Governor} for simple, 3 options, vote counting.
 */
abstract contract GovernorCountingSimple is Governor, BokkyPooBahsRedBlackTreeRaw {
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

    uint256 public totalVotesCast; // Total votes cast in contest so far
    mapping(address => uint256) public addressTotalCastVoteCounts;
    mapping(uint256 => ProposalVote) public proposalVotesStructs;

    mapping(uint256 => uint256) public voteAmountCount; // forVotes amount => count, used with the RB tree to determine ties

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function proposalVotes(uint256 proposalId) public view virtual returns (uint256 forVotes, uint256 againstVotes) {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];
        return (proposalvote.proposalVoteCounts.forVotes, proposalvote.proposalVoteCounts.againstVotes);
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
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];
        return (
            proposalvote.addressVoteCounts[userAddress].forVotes,
            proposalvote.addressVoteCounts[userAddress].againstVotes
        );
    }

    /**
     * @dev Accessor to which addresses have cast a vote for a given proposal.
     */
    function proposalAddressesHaveVoted(uint256 proposalId) public view virtual returns (address[] memory) {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];
        return proposalvote.addressesVoted;
    }

    /**
     * @dev Accessor to how many votes an address has cast total for the contest so far.
     */
    function contestAddressTotalVotesCast(address userAddress)
        public
        view
        virtual
        returns (uint256 userTotalVotesCast)
    {
        return addressTotalCastVoteCounts[userAddress];
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).
     */
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, uint256 totalVotes)
        internal
        virtual
        override
    {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];

        require(
            numVotes <= (totalVotes - addressTotalCastVoteCounts[account]),
            "GovernorVotingSimple: not enough votes left to cast"
        );

        bool firstTimeVoting = (
            proposalvote.addressVoteCounts[account].forVotes == 0
                && proposalvote.addressVoteCounts[account].againstVotes == 0
        );

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
        addressTotalCastVoteCounts[account] += numVotes;
        totalVotesCast += numVotes;

        // the RB tree cannot be used if downvoting is enabled
        // also, keys in the RB tree cannot be 0 - this is checked for in _castVote in Governor.sol
        // keys in the RB tree are forVotes counts
        if (downvotingAllowed() == 0) {
            uint256 newVotes = proposalvote.proposalVoteCounts.forVotes;
            uint256 oldVotes = newVotes - numVotes;

            // In order to update, we first have to remove the old value, then insert the new one

            // REMOVAL

            //// if the old number of votes for this proposal was 0, you don't need to remove anything
            //// if it was more, then we do need to deal with the old value
            if (oldVotes > 0) {
                //// decrement the copy count of the old value
                voteAmountCount[oldVotes] -= 1;

                //// only remove from the tree if there are no more proposals left with this proposal's old number of votes after decrementing
                if (voteAmountCount[oldVotes] == 0) {
                    _remove(oldVotes);
                }
            }

            // INSERTION

            //// dupe keys cannot be inserted
            if (!exists(newVotes)) {
                //// insert the vote amount into the tree
                _insert(proposalvote.proposalVoteCounts.forVotes);
            }

            //// increment the copy count of the new vote amount for the proposal
            //// this is how we keep track of dupes
            voteAmountCount[newVotes]++;
        }
    }
}
