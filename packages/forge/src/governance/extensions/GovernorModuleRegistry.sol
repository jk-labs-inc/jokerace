// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";
import "../../modules/RewardsModule.sol";

/**
 * @dev Extension of {Governor} for module management.
 *
 */
abstract contract GovernorModuleRegistry is Governor {
    event OfficialRewardsModuleSet(RewardsModule oldOfficialRewardsModule, RewardsModule newOfficialRewardsModule);

    RewardsModule public officialRewardsModule;

    /**
     * @dev Get the official rewards module contract for this contest (effectively reverse record).
     */
    function setOfficialRewardsModule(RewardsModule officialRewardsModule_) public virtual {
        require(msg.sender == creator(), "GovernorModuleRegistry: only the creator can set the official rewards module");
        RewardsModule oldOfficialRewardsModule = officialRewardsModule;
        officialRewardsModule = officialRewardsModule_;
        emit OfficialRewardsModuleSet(oldOfficialRewardsModule, officialRewardsModule_);
    }
}
