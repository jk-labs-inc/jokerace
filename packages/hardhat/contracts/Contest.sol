// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./governance/Governor.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorVotes.sol";

contract Contest is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    constructor(string memory _name, IVotes _token, uint256 _initialVotingDelay, uint256 _initialVotingPeriod,
                uint256 _initialProposalThreshold, uint64 _voteStartBlock, uint256 _initialMaxProposalCount)
        Governor(_name)
        GovernorSettings(_initialVotingDelay /* 5 = 1 minute */, _initialVotingPeriod /* 45 = 10 minutes */, 
                         _initialProposalThreshold /* 1e18 = 1 token needed to vote */, _voteStartBlock,
                        _initialMaxProposalCount)
        GovernorVotes(_token)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function maxProposalCount()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.maxProposalCount();
    }

    function contestStart()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.contestStart();
    }

    function owner()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (address)
    {
        return super.owner();
    }
}
