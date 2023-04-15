// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./governance/Governor.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorModuleRegistry.sol";

contract Contest is Governor, GovernorSettings, GovernorCountingSimple, GovernorModuleRegistry {
    constructor(
        string memory _name,
        string memory _prompt,
        bytes32 _submissionMerkleRoot,
        bytes32 _votingMerkleRoot,
        uint256[] memory _constructorIntParams
    )
        Governor(_name, _prompt, _submissionMerkleRoot, _votingMerkleRoot)
        GovernorSettings(
            _constructorIntParams[0], // _initialContestStart
            _constructorIntParams[1], // _initialVotingDelay,
            _constructorIntParams[2], // _initialVotingPeriod,
            _constructorIntParams[3], // _initialContestSnapshot,
            _constructorIntParams[4], // _initialProposalThreshold,
            _constructorIntParams[5], // _initialNumAllowedProposalSubmissions,
            _constructorIntParams[6], // _initialMaxProposalCount
            _constructorIntParams[7], // _initialDownvotingAllowed
            _constructorIntParams[8] // _initialSubmissionGatingByVotingToken
        )
    {}

    // The following functions are overrides required by Solidity.

    function contestStart() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.contestStart();
    }

    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function numAllowedProposalSubmissions() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.numAllowedProposalSubmissions();
    }

    function maxProposalCount() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.maxProposalCount();
    }

    function downvotingAllowed() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.downvotingAllowed();
    }

    function creator() public view override(IGovernor, GovernorSettings) returns (address) {
        return super.creator();
    }
}
