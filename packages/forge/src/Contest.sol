// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorModuleRegistry.sol";
import "./governance/extensions/GovernorEngagement.sol";

contract Contest is GovernorCountingSimple, GovernorModuleRegistry, GovernorEngagement {
    uint256 public constant SECONDS_IN_WEEK = 604800;

    error PayPerVoteMustBeEnabledForAnyoneCanVote();
    error PeriodsCannotBeMoreThanAWeek();
    error RankLimitCannotBeZero();

    constructor(ConstructorArgs memory _constructorArgs)
        Governor(_constructorArgs)
        GovernorSorting(_constructorArgs.intConstructorArgs.sortingEnabled, _constructorArgs.intConstructorArgs.rankLimit)
    {
        if (
            (_constructorArgs.intConstructorArgs.votingDelay > SECONDS_IN_WEEK)
                || (_constructorArgs.intConstructorArgs.votingPeriod > SECONDS_IN_WEEK)
        ) {
            revert PeriodsCannotBeMoreThanAWeek();
        }

        if (_constructorArgs.intConstructorArgs.rankLimit == 0) revert RankLimitCannotBeZero();
    }
}
