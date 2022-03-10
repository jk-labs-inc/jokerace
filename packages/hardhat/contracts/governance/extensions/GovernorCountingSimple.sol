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
        For
    }

    struct VoteCounts {
        uint256 forVotes;
    }

    struct ProposalVote {
        VoteCounts proposalVoteCounts;
        mapping(address => uint256) addressTotalVoteCount;
        mapping(address => VoteCounts) addressVoteCounts;
    }

    mapping(uint256 => ProposalVote) private _proposalVotes;

    /**
     * @dev See {IGovernor-COUNTING_MODE}. 
     */
    // solhint-disable-next-line func-name-mixedcase
    function COUNTING_MODE() public pure virtual override returns (string memory) {
        return "support=for";
    }

    /**
     * @dev Accessor to the internal vote counts.
     */
    function proposalVotes(uint256 proposalId)
        public
        view
        virtual
        returns (
            uint256 forVotes
        )
    {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (proposalvote.proposalVoteCounts.forVotes);
    }

    /**
     * @dev Accessor to how many votes an address has cast.
     */
    function proposalAddressVotes(uint256 proposalId, address userAddress)
        public
        view
        virtual
        returns (
            uint256 forVotes
        )
    {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (proposalvote.addressVoteCounts[userAddress].forVotes);
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).
     */
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 numVotes,
        uint256 totalVotes
    ) internal virtual override {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];

        require(numVotes <= (totalVotes - proposalvote.addressTotalVoteCount[account]), "GovernorVotingSimple: not enough votes left to cast");

        proposalvote.addressTotalVoteCount[account] += numVotes;

        if (support == uint8(VoteType.For)) {
            proposalvote.proposalVoteCounts.forVotes += numVotes;
            proposalvote.addressVoteCounts[account].forVotes += numVotes;
        } else {
            revert("GovernorVotingSimple: invalid value for enum VoteType");
        }
    }
}
