// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";
import "./GovernorSorting.sol";

/**
 * @dev Extension of {Governor} for simple, 3 options, vote counting.
 */
abstract contract GovernorCountingSimple is Governor, GovernorSorting {
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

    mapping(uint256 => uint256[]) public forVotesToProposalId;

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
            if (!isProposalDeleted(proposalIds[i])) {
                proposalIdsWithoutDeleted[newArraysIndexCounter] = proposalIds[i];
                proposalVoteCountsArray[newArraysIndexCounter] = proposalVotesStructs[proposalIds[i]].proposalVoteCounts;
                newArraysIndexCounter += 1;
            }
        }
        return (proposalIdsWithoutDeleted, proposalVoteCountsArray);
    }

    /**
     * @dev Get the only proposal id with this many for votes.
     * NOTE: Should only get called at a point at which you are sure there is only one proposal id
     *       with a certain number of forVotes (we only use it in the RewardsModule after ties have
     *       been checked for).
     */
    function getOnlyProposalIdWithThisManyForVotes(uint256 forVotes) public view returns (uint256 proposalId) {
        uint256[] memory proposalIdList = forVotesToProposalId[forVotes];
        for (uint256 i = 0; i < proposalIdList.length; i++) {
            if (proposalIdList[i] != 0) {
                return proposalIdList[i];
            }
        }
        revert("GovernorCountingSimple: tried to call getOnlyProposalIdWithThisManyForVotes and couldn't find one");
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

        // sorting and consequently rewards module compatability is only available if downvoting is disabled
        if (downvotingAllowed() == 0) {
            // update a map of forVotes => proposalId[] to be able to go from rank => proposalId
            uint256 oldForVotes = proposalvote.proposalVoteCounts.forVotes - numVotes;
            if (oldForVotes > 0) {
                uint256[] memory oldPropIdList = forVotesToProposalId[oldForVotes];
                for (uint256 i = 0; i < oldPropIdList.length; i++) {
                    if (oldPropIdList[i] == proposalId) {
                        delete oldPropIdList[i];
                        break;
                    }
                }
            }
            forVotesToProposalId[proposalvote.proposalVoteCounts.forVotes].push(proposalId);

            updateRanks(proposalvote.proposalVoteCounts.forVotes - numVotes, proposalvote.proposalVoteCounts.forVotes);
        }
    }
}
