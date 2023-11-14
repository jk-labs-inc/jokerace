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
        _contestStart = initialContestStart;
        _votingDelay = initialVotingDelay;
        _votingPeriod = initialVotingPeriod;
        _numAllowedProposalSubmissions = initialNumAllowedProposalSubmissions;
        _maxProposalCount = initialMaxProposalCount;
        _downvotingAllowed = initialDownvotingAllowed;
        _creator = msg.sender;
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
}
