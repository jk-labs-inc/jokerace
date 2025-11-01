// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "../Governor.sol";
import "../../modules/VoterRewardsModule.sol";

/**
 * @dev Extension of {Governor} for module management.
 */
abstract contract GovernorModuleRegistry is Governor {
    event OfficialRewardsModuleSet(address oldOfficialRewardsModule, address newOfficialRewardsModule);

    address public officialRewardsModule;

    error OnlyCreatorCanSetRewardsModule();
    error OfficialRewardsModuleCanOnlyBeSetOnce();
    error OfficialRewardsModuleMustPointToThisContest();

    /**
     * @dev Returns the official rewards module.
     */
    function _getOfficialRewardsModule() internal view override returns (address) {
        return officialRewardsModule;
    }

    /**
     * @dev Get the official rewards module contract for this contest (effectively reverse record).
     */
    function setOfficialRewardsModule(address officialRewardsModule_) public {
        if (msg.sender != creator) revert OnlyCreatorCanSetRewardsModule();
        if (officialRewardsModule != address(0)) revert OfficialRewardsModuleCanOnlyBeSetOnce();
        if (address(VoterRewardsModule(payable(officialRewardsModule_)).underlyingContest()) != address(this)) {
            revert OfficialRewardsModuleMustPointToThisContest();
        }
        address oldOfficialRewardsModule = officialRewardsModule;
        officialRewardsModule = officialRewardsModule_;
        emit OfficialRewardsModuleSet(oldOfficialRewardsModule, officialRewardsModule_);
    }
}
