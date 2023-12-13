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
            _constructorIntParams[5], // downvotingAllowed
            _constructorIntParams[6], // costToPropose
            _constructorIntParams[7] // percentageToCreator
        )
        GovernorSorting(
            _constructorIntParams[8], // sortingEnabled
            _constructorIntParams[9] // rankLimit
        )
    {}
}
