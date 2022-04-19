// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./governance/Governor.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorVotes.sol";

contract Contest is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    constructor(string memory _name, IVotes _token, uint64 _initialContestStart, 
                uint256 _initialVotingDelay, uint256 _initialVotingPeriod, uint256 _initialContestSnapshot,
                uint256 _initialProposalThreshold, uint256 _initialMaxProposalCount)
        Governor(_name)
        GovernorSettings(_initialContestStart, _initialVotingDelay, _initialVotingPeriod,
                        _initialContestSnapshot, _initialProposalThreshold, _initialMaxProposalCount)
        GovernorVotes(_token)
    {}

    // The following functions are overrides required by Solidity.

    function contestStart()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.contestStart();
    }

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

    function creator()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (address)
    {
        return super.creator();
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function getCurrentVotes(address account)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getCurrentVotes(account);
    }
}
