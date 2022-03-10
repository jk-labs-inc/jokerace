// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (governance/extensions/GovernorSettings.sol)

pragma solidity ^0.8.0;

import "../Governor.sol";
import "../../utils/Timers.sol";

/**
 * @dev Extension of {Governor} for settings updatable through governance.
 *
 * _Available since v4.4._
 */
abstract contract GovernorSettings is Governor {
    using Timers for Timers.BlockNumber;
    uint256 private _votingDelay;
    uint256 private _votingPeriod;
    uint256 private _proposalThreshold;
    uint256 private _maxProposalCount;
    Timers.BlockNumber private _voteStart;
    address private _owner;

    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
    event VoteStartBlockSet(uint256 oldVoteStartBlock, uint64 newVoteStartBlock);
    event MaxProposalCountSet(uint256 oldMaxProposalCount, uint256 newMaxProposalCount);
    event OwnerSet(address oldOwner, address newOwner);

    /**
     * @dev Initialize the governance parameters.
     */
    constructor(
        uint256 initialVotingDelay,
        uint256 initialVotingPeriod,
        uint256 initialProposalThreshold,
        uint64  voteStartBlock,
        uint256 initialMaxProposalCount
    ) {
        _setVotingDelay(initialVotingDelay);
        _setVotingPeriod(initialVotingPeriod);
        _setProposalThreshold(initialProposalThreshold);
        _setVoteStart(voteStartBlock);
        _setMaxProposalCount(initialMaxProposalCount);
        _setOwner(msg.sender);
    }

    /**
     * @dev See {IGovernor-votingDelay}.
     */
    function votingDelay() public view virtual override returns (uint256) {
        return _votingDelay;
    }

    /**
     * @dev See {IGovernor-votingPeriod}.
     */
    function votingPeriod() public view virtual override returns (uint256) {
        return _votingPeriod;
    }

    /**
     * @dev See {Governor-proposalThreshold}.
     */
    function proposalThreshold() public view virtual override returns (uint256) {
        return _proposalThreshold;
    }

    /**
     * @dev Max number of proposals allowed in this contest
     */
    function maxProposalCount() public view virtual override returns (uint256) {
        return _maxProposalCount;
    }

    /**
     * @dev See {IGovernor-contestStart}.
     */
    function contestStart() public view virtual override returns (uint256) {
        return _voteStart.getDeadline();
    }

    /**
     * @dev See {IGovernor-owner}.
     */
    function owner() public view virtual override returns (address) {
        return _owner;
    }

    /**
     * @dev Internal setter for the voting delay.
     *
     * Emits a {VotingDelaySet} event.
     */
    function _setVotingDelay(uint256 newVotingDelay) internal virtual {
        emit VotingDelaySet(_votingDelay, newVotingDelay);
        _votingDelay = newVotingDelay;
    }

    /**
     * @dev Internal setter for the voting period.
     *
     * Emits a {VotingPeriodSet} event.
     */
    function _setVotingPeriod(uint256 newVotingPeriod) internal virtual {
        // voting period must be at least one block long
        require(newVotingPeriod > 0, "GovernorSettings: voting period too low");
        emit VotingPeriodSet(_votingPeriod, newVotingPeriod);
        _votingPeriod = newVotingPeriod;
    }

    /**
     * @dev Internal setter for the proposal threshold.
     *
     * Emits a {ProposalThresholdSet} event.
     */
    function _setProposalThreshold(uint256 newProposalThreshold) internal virtual {
        emit ProposalThresholdSet(_proposalThreshold, newProposalThreshold);
        _proposalThreshold = newProposalThreshold;
    }

    /**
     * @dev Internal setter for the max proposal count.
     *
     * Emits a {MaxProposalCountSet} event.
     */
    function _setMaxProposalCount(uint256 newMaxProposalCount) internal virtual {
        emit MaxProposalCountSet(_maxProposalCount, newMaxProposalCount);
        _maxProposalCount = newMaxProposalCount;
    }

    /**
     * @dev Internal setter for the voteStart.
     *
     * Emits a {ProposalThresholdSet} event.
     */
    function _setVoteStart(uint64 newVoteStartBlock) internal virtual {
        emit VoteStartBlockSet(_voteStart.getDeadline(), newVoteStartBlock);
        _voteStart.setDeadline(newVoteStartBlock);
    }

    /**
     * @dev Internal setter for owner.
     *
     * Emits a {OwnerSet} event.
     */
    function _setOwner(address newOwner) internal virtual {
        emit OwnerSet(_owner, newOwner);
        _owner = newOwner;
    }
}
