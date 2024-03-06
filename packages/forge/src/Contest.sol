// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "./governance/Governor.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorModuleRegistry.sol";
import "./governance/extensions/GovernorEngagement.sol";
import "./governance/utils/GovernorSorting.sol";

contract Contest is GovernorCountingSimple, GovernorModuleRegistry, GovernorEngagement {
    constructor(
        string memory _name,
        string memory _prompt,
        bytes32 _submissionMerkleRoot,
        bytes32 _votingMerkleRoot,
        ConstructorIntArgs memory _constructorIntArgs
    )
        Governor(_name, _prompt, _constructorIntArgs)
        GovernorSorting(_constructorIntArgs.sortingEnabled, _constructorIntArgs.rankLimit)
        GovernorMerkleVotes(_submissionMerkleRoot, _votingMerkleRoot)
    {}
}
