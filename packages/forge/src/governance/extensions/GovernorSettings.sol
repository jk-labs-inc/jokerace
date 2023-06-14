// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";
import "@openzeppelin/utils/Timers.sol";

/**
 * @dev Extension of {Governor} for settings updatable through governance.
 */
abstract contract GovernorSettings is Governor {
    uint256 private _contestStart;
    uint256 private _votingDelay;
    uint256 private _votingPeriod;
    uint256 private _numAllowedProposalSubmissions;
    uint256 private _maxProposalCount;
    uint256 private _downvotingAllowed;
    address private _creator;

    event ContestStartSet(uint256 oldContestStart, uint256 newContestStart);
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event NumAllowedProposalSubmissionsSet(
        uint256 oldNumAllowedProposalSubmissions, uint256 newNumAllowedProposalSubmissions
    );
    event MaxProposalCountSet(uint256 oldMaxProposalCount, uint256 newMaxProposalCount);
    event DownvotingAllowedSet(uint256 oldDownvotingAllowed, uint256 newDownvotingAllowed);
    event CreatorSet(address oldCreator, address newCreator);

    /**
     * @dev Initialize the governance parameters.
     */
    constructor(
        uint256 initialContestStart,
        uint256 initialVotingDelay,
        uint256 initialVotingPeriod,
        uint256 initialNumAllowedProposalSubmissions,
        uint256 initialMaxProposalCount,
        uint256 initialDownvotingAllowed
    ) {
        _setContestStart(initialContestStart);
        _setVotingDelay(initialVotingDelay);
        _setVotingPeriod(initialVotingPeriod);
        _setNumAllowedProposalSubmissions(initialNumAllowedProposalSubmissions);
        _setMaxProposalCount(initialMaxProposalCount);
        _setDownvotingAllowed(initialDownvotingAllowed);
        _setCreator(msg.sender);
    }

    /**
     * @dev See {IGovernor-contestStart}.
     */
    function contestStart() public view virtual override returns (uint256) {
        return _contestStart;
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
     * @dev See {Governor-numAllowedProposalSubmissions}.
     */
    function numAllowedProposalSubmissions() public view virtual override returns (uint256) {
        return _numAllowedProposalSubmissions;
    }

    /**
     * @dev Max number of proposals allowed in this contest
     */
    function maxProposalCount() public view virtual override returns (uint256) {
        return _maxProposalCount;
    }

    /**
     * @dev If downvoting is enabled in this contest
     */
    function downvotingAllowed() public view virtual override returns (uint256) {
        return _downvotingAllowed;
    }

    /**
     * @dev See {IGovernor-creator}.
     */
    function creator() public view virtual override returns (address) {
        return _creator;
    }

    /**
     * @dev Internal setter for the contestStart.
     *
     * Emits a {ContestStartSet} event.
     */
    function _setContestStart(uint256 newContestStart) internal virtual {
        emit ContestStartSet(_contestStart, newContestStart);
        _contestStart = newContestStart;
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
     * @dev Internal setter for the number of allowed proposal submissions per permissioned address.
     *
     * Emits a {NumAllowedProposalSubmissionsSet} event.
     */
    function _setNumAllowedProposalSubmissions(uint256 newNumAllowedProposalSubmissions) internal virtual {
        emit NumAllowedProposalSubmissionsSet(_numAllowedProposalSubmissions, newNumAllowedProposalSubmissions);
        _numAllowedProposalSubmissions = newNumAllowedProposalSubmissions;
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
     * @dev Internal setter for if downvoting is allowed.
     *
     * Emits a {DownvotingAllowedSet} event.
     */
    function _setDownvotingAllowed(uint256 newDownvotingAllowed) internal virtual {
        emit DownvotingAllowedSet(_downvotingAllowed, newDownvotingAllowed);
        _downvotingAllowed = newDownvotingAllowed;
    }

    /**
     * @dev Internal setter for creator.
     *
     * Emits a {CreatorSet} event.
     */
    function _setCreator(address newCreator) internal virtual {
        emit CreatorSet(_creator, newCreator);
        _creator = newCreator;
    }
}
