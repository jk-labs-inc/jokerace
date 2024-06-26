// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorModuleRegistry.sol";
import "./governance/extensions/GovernorEngagement.sol";

contract Contest is GovernorCountingSimple, GovernorModuleRegistry, GovernorEngagement {
    error SortingAndDownvotingCannotBothBeEnabled();
    error PayPerVoteMustBeEnabledForAnyoneCanVote();

    constructor(
        string memory _name,
        string memory _prompt,
        bytes32 _submissionMerkleRoot,
        bytes32 _votingMerkleRoot,
        ConstructorArgs memory _constructorArgs
    )
        Governor(_name, _prompt, _constructorArgs)
        GovernorSorting(_constructorArgs.sortingEnabled, _constructorArgs.rankLimit)
        GovernorMerkleVotes(_submissionMerkleRoot, _votingMerkleRoot)
    {
        if (_constructorArgs.sortingEnabled == 1 && _constructorArgs.downvotingAllowed == 1) {
            revert SortingAndDownvotingCannotBothBeEnabled();
        }
        if (_votingMerkleRoot == 0 && _constructorArgs.payPerVote == 0) {
            revert PayPerVoteMustBeEnabledForAnyoneCanVote();
        }
    }
}
