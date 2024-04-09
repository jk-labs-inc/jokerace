// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "../Governor.sol";
import "../../modules/RewardsModule.sol";
import "../../modules/CommitRevealModule.sol";

/**
 * @dev Extension of {Governor} for module management.
 */
abstract contract GovernorModuleRegistry is Governor {
    event OfficialRewardsModuleSet(RewardsModule oldOfficialRewardsModule, RewardsModule newOfficialRewardsModule);
    event OfficialCommitRevealModuleSet(CommitRevealModule oldOfficialCommitRevealModule, CommitRevealModule newOfficialCommitRevealModule);

    RewardsModule public officialRewardsModule;
    CommitRevealModule public officialCommitRevealModule;

    error OnlyCreatorCanSetModule();

    /**
     * @dev Get the official rewards module contract for this contest (effectively reverse record).
     */
    function setOfficialRewardsModule(RewardsModule officialRewardsModule_) public {
        if (msg.sender != creator) revert OnlyCreatorCanSetModule();
        RewardsModule oldOfficialRewardsModule = officialRewardsModule;
        officialRewardsModule = officialRewardsModule_;
        emit OfficialRewardsModuleSet(oldOfficialRewardsModule, officialRewardsModule_);
    }

    /**
     * @dev Get the official commit-reveal module contract for this contest (effectively reverse record).
     */
    function setOfficialCommitRevealModule(CommitRevealModule officialCommitRevealModule_) public {
        if (msg.sender != creator) revert OnlyCreatorCanSetModule();
        CommitRevealModule oldOfficialCommitRevealModule = officialCommitRevealModule;
        officialCommitRevealModule = officialCommitRevealModule_;
        emit OfficialCommitRevealModuleSet(oldOfficialCommitRevealModule, officialCommitRevealModule_);
    }

    /**
     * @dev Function to return the official Commit Reveal Module for the contest.
     */
    function _officialCommitRevealModuleAddress() internal override view returns (address) {
        return address(officialCommitRevealModule);
    }
}
