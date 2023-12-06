// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";

/**
 * @dev Extension of {Governor} for simple vote counting.
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

    mapping(uint256 => uint256[]) public forVotesToProposalIds;

    error MoreThanOneProposalWithThisManyVotes();
    error NotEnoughVotesLeft();
    error DownvotingNotEnabled();
    error InvalidVoteType();

    error RankCannotBeZero();
    error RankIsNotInSortedRanks();
    error IndexHasNotBeenPopulated();

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function proposalVotes(uint256 proposalId) public view returns (uint256 forVotes, uint256 againstVotes) {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];
        return (proposalvote.proposalVoteCounts.forVotes, proposalvote.proposalVoteCounts.againstVotes);
    }

    /**
     * @dev Accessor to how many votes an address has cast for a given proposal.
     */
    function proposalAddressVotes(uint256 proposalId, address userAddress)
        public
        view
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
    function proposalAddressesHaveVoted(uint256 proposalId) public view returns (address[] memory) {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];
        return proposalvote.addressesVoted;
    }

    /**
     * @dev Accessor to how many votes an address has cast total for the contest so far.
     */
    function contestAddressTotalVotesCast(address userAddress) public view returns (uint256 userTotalVotesCast) {
        return addressTotalCastVoteCounts[userAddress];
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function allProposalTotalVotes()
        public
        view
        returns (uint256[] memory proposalIdsReturn, VoteCounts[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIdsMemVar = getAllProposalIds();
        VoteCounts[] memory proposalVoteCountsArray = new VoteCounts[](proposalIdsMemVar.length);
        for (uint256 i = 0; i < proposalIdsMemVar.length; i++) {
            proposalVoteCountsArray[i] = proposalVotesStructs[proposalIdsMemVar[i]].proposalVoteCounts;
        }
        return (proposalIdsMemVar, proposalVoteCountsArray);
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal that excludes deleted proposals.
     */
    function allProposalTotalVotesWithoutDeleted()
        public
        view
        returns (uint256[] memory proposalIdsReturn, VoteCounts[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIdsMemVar = getAllProposalIds();
        uint256[] memory proposalIdsWithoutDeleted = new uint256[](proposalIdsMemVar.length);
        VoteCounts[] memory proposalVoteCountsArray = new VoteCounts[](proposalIdsMemVar.length);

        uint256 newArraysIndexCounter = 0;
        for (uint256 i = 0; i < proposalIdsMemVar.length; i++) {
            if (!proposalIsDeleted[proposalIdsMemVar[i]]) {
                proposalIdsWithoutDeleted[newArraysIndexCounter] = proposalIdsMemVar[i];
                proposalVoteCountsArray[newArraysIndexCounter] =
                    proposalVotesStructs[proposalIdsMemVar[i]].proposalVoteCounts;
                newArraysIndexCounter += 1;
            }
        }
        return (proposalIdsWithoutDeleted, proposalVoteCountsArray);
    }

    /**
     * @dev Get the whole array in `forVotesToProposalIds` for a given `forVotes` amount.
     */
    function getProposalsWithThisManyForVotes(uint256 forVotes)
        public
        view
        returns (uint256[] memory proposalsWithThisManyForVotes)
    {
        return forVotesToProposalIds[forVotes];
    }

    /**
     * @dev Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view override returns (uint256 count) {
        return forVotesToProposalIds[forVotes].length;
    }

    /**
     * @dev Get the only proposal id with this many for votes.
     * NOTE: Should only get called at a point at which you are sure there is only one proposal id
     *       with a certain number of forVotes (we only use it in the RewardsModule after ties have
     *       been checked for).
     */
    function getOnlyProposalIdWithThisManyForVotes(uint256 forVotes) public view returns (uint256 proposalId) {
        if (forVotesToProposalIds[forVotes].length != 1) revert MoreThanOneProposalWithThisManyVotes();
        return forVotesToProposalIds[forVotes][0];
    }

    /**
     * @dev Get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account.
     *      A rank has to have > 0 votes to be considered valid.
     */
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        if (rank == 0) revert RankCannotBeZero();

        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        uint256 counter = 1;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
            // if this is a value of a deleted proposal or an ungarbage collected oldValue, go forwards without
            // incrementing the counter
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
        revert RankIsNotInSortedRanks();
    }

    /**
     * @dev Returns whether a given index in sortedRanks is tied or is below a tied rank.
     */
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > sortedRanks.length - 1) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert IndexHasNotBeenPopulated();
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyForVotes(sortedRanks[index]) > 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Remove this proposalId from the list of proposalIds that share its current forVotes
     *      value in forVotesToProposalIds.
     */
    function _rmProposalIdFromForVotesMap(uint256 proposalId, uint256 forVotes) internal {
        uint256[] memory forVotesToPropIdMemVar = forVotesToProposalIds[forVotes]; // only check state var once to save on gas
        for (uint256 i = 0; i < forVotesToPropIdMemVar.length; i++) {
            if (forVotesToPropIdMemVar[i] == proposalId) {
                // swap with last item and pop bc we don't care about order.
                // makes things cleaner (than just deleting) and saves on gas if there end up being a ton of proposals that pass
                // through having a certain number of votes throughout the contest.
                forVotesToProposalIds[forVotes][i] = forVotesToPropIdMemVar[forVotesToPropIdMemVar.length - 1];
                forVotesToProposalIds[forVotes].pop();
                break;
            }
        }
    }

    /**
     * @dev See {Governor-_multiRmProposalIdFromForVotesMap}.
     */
    function _multiRmProposalIdFromForVotesMap(uint256[] calldata proposalIdsToDelete) internal override {
        for (uint256 i = 0; i < proposalIdsToDelete.length; i++) {
            uint256 currentProposalId = proposalIdsToDelete[i];
            uint256 currentProposalsForVotes = proposalVotesStructs[currentProposalId].proposalVoteCounts.forVotes;

            // remove this proposalId from the list of proposalIdsToDelete that share its current forVotes
            // value in forVotesToProposalIds
            _rmProposalIdFromForVotesMap(currentProposalId, currentProposalsForVotes);
        }
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).
     */
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, uint256 totalVotes)
        internal
        override
    {
        ProposalVote storage proposalvote = proposalVotesStructs[proposalId];

        if (numVotes > (totalVotes - addressTotalCastVoteCounts[account])) revert NotEnoughVotesLeft();

        bool firstTimeVoting = (
            proposalvote.addressVoteCounts[account].forVotes == 0
                && proposalvote.addressVoteCounts[account].againstVotes == 0
        );

        if (support == uint8(VoteType.For)) {
            proposalvote.proposalVoteCounts.forVotes += numVotes;
            proposalvote.addressVoteCounts[account].forVotes += numVotes;
        } else if (support == uint8(VoteType.Against)) {
            if (downvotingAllowed != 1) revert DownvotingNotEnabled();
            proposalvote.proposalVoteCounts.againstVotes += numVotes;
            proposalvote.addressVoteCounts[account].againstVotes += numVotes;
        } else {
            revert InvalidVoteType();
        }

        if (firstTimeVoting) {
            proposalvote.addressesVoted.push(account);
        }
        addressTotalCastVoteCounts[account] += numVotes;
        totalVotesCast += numVotes;

        // sorting and consequently rewards module compatibility is only available if downvoting is disabled and sorting enabled
        if ((downvotingAllowed == 0) && (sortingEnabled == 1)) {
            uint256 newForVotes = proposalvote.proposalVoteCounts.forVotes; // only check state var once to save on gas
            uint256 oldForVotes = newForVotes - numVotes;

            // update map of forVotes => proposalId[] to be able to go from rank => proposalId.
            // if oldForVotes is 0, then this proposal will not already be in this map, so we don't need to rm it
            if (oldForVotes > 0) {
                _rmProposalIdFromForVotesMap(proposalId, oldForVotes);
            }
            forVotesToProposalIds[newForVotes].push(proposalId);

            _updateRanks(oldForVotes, newForVotes);
        }
    }
}
