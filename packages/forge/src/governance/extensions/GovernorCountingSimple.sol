// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";

/**
 * @dev Extension of {Governor} for simple, 3 options, vote counting.
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

    uint256 public totalVotesCast; // Total votes cast in contest so far
    mapping(address => uint256) public addressTotalCastVoteCounts;
    mapping(uint256 => ProposalVote) public proposalVotesStructs;

    // TODO: rename to forVotesToProposalIds
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
     * @dev See {GovernorSorting-getNumProposalsWithThisManyForVotes}. Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view override returns (uint256 count) {
        return forVotesToProposalId[forVotes].length;
    }

    /**
     * @dev Get the only proposal id with this many for votes.
     * NOTE: Should only get called at a point at which you are sure there is only one proposal id
     *       with a certain number of forVotes (we only use it in the RewardsModule after ties have
     *       been checked for).
     */
    function getOnlyProposalIdWithThisManyForVotes(uint256 forVotes) public view returns (uint256 proposalId) {
        require(
            forVotesToProposalId[forVotes].length == 1,
            "GovernorCountingSimple: tried to call getOnlyProposalIdWithThisManyForVotes and couldn't find one"
        );
        return forVotesToProposalId[forVotes][0];
    }

    /**
     * @dev Remove this proposalId from the list of proposalIds that share its current forVotes
     *      value in forVotesToProposalId.
     */
    function _rmProposalIdFromForVotesMap(uint256 proposalId, uint256 forVotes) internal {
        uint256[] memory forVotesToPropIdMemVar = forVotesToProposalId[forVotes]; // only check state var once to save on gas
        for (uint256 i = 0; i < forVotesToPropIdMemVar.length; i++) {
            if (forVotesToPropIdMemVar[i] == proposalId) {
                // swap with last item and pop bc we don't care about order.
                // makes things cleaner (than just deleting) and saves on gas if there end up being a ton of proposals that pass
                // through having a certain number of votes throughout the contest.
                forVotesToProposalId[forVotes][i] = forVotesToPropIdMemVar[forVotesToPropIdMemVar.length - 1];
                forVotesToProposalId[forVotes].pop();
                break;
            }
        }
    }

    /**
     * @dev See {Governor-_removeDeletedProposalIds}.
     */
    function _deletedProposalsSortingCleanup(uint256[] calldata proposalIds) internal virtual override {
        for (uint256 i = 0; i < proposalIds.length; i++) {
            uint256 currentProposalId = proposalIds[i];
            uint256 currentProposalsForVotes = proposalVotesStructs[currentProposalId].proposalVoteCounts.forVotes;

            // remove this proposalId from the list of proposalIds that share its current forVotes
            // value in forVotesToProposalId
            _rmProposalIdFromForVotesMap(currentProposalId, currentProposalsForVotes);
        }
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

        // sorting and consequently rewards module compatibility is only available if downvoting is disabled
        if (downvotingAllowed() == 0) {
            uint256 newForVotes = proposalvote.proposalVoteCounts.forVotes; // only check state var once to save on gas

            // update a map of forVotes => proposalId[] to be able to go from rank => proposalId
            uint256 oldForVotes = newForVotes - numVotes;
            if (oldForVotes > 0) {
                _rmProposalIdFromForVotesMap(proposalId, oldForVotes);
            }
            forVotesToProposalId[newForVotes].push(proposalId);

            _updateRanks(oldForVotes, newForVotes);
        }
    }
}
