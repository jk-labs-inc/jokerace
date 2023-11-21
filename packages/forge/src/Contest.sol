// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./governance/Governor.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorModuleRegistry.sol";
import "./governance/utils/GovernorSorting.sol";

contract Contest is GovernorCountingSimple, GovernorModuleRegistry {
    constructor(
        string memory _name,
        string memory _prompt,
        bytes32 _submissionMerkleRoot,
        bytes32 _votingMerkleRoot,
        uint256[] memory _constructorIntParams
    )
        Governor(
            _name,
            _prompt,
            _submissionMerkleRoot,
            _votingMerkleRoot,
            _constructorIntParams[0], // contestStart
            _constructorIntParams[1], // votingDelay,
            _constructorIntParams[2], // votingPeriod,
            _constructorIntParams[3], // numAllowedProposalSubmissions,
            _constructorIntParams[4], // maxProposalCount
            _constructorIntParams[5], // costToPropose
            _constructorIntParams[6] // percentageToCreator
        )
        GovernorSorting(
            _constructorIntParams[7], // sortingEnabled
            _constructorIntParams[8] // rankLimit
        )
    {}
}
