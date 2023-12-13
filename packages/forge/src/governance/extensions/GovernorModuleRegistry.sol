// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "../Governor.sol";
import "../../modules/RewardsModule.sol";

/**
 * @dev Extension of {Governor} for module management.
 */
abstract contract GovernorModuleRegistry is Governor {
    event OfficialRewardsModuleSet(RewardsModule oldOfficialRewardsModule, RewardsModule newOfficialRewardsModule);

    RewardsModule public officialRewardsModule;

    error OnlyCreatorCanSetRewardsModule();

    /**
     * @dev Get the official rewards module contract for this contest (effectively reverse record).
     */
    function setOfficialRewardsModule(RewardsModule officialRewardsModule_) public {
        if (msg.sender != creator) revert OnlyCreatorCanSetRewardsModule();
        RewardsModule oldOfficialRewardsModule = officialRewardsModule;
        officialRewardsModule = officialRewardsModule_;
        emit OfficialRewardsModuleSet(oldOfficialRewardsModule, officialRewardsModule_);
    }
}
