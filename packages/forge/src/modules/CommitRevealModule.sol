// SPDX-License-Identifier: AGPL-3.0-only
// Forked from OpenZeppelin Contracts (v4.7.0) (finance/PaymentSplitter.sol)
pragma solidity ^0.8.19;

import "@openzeppelin/utils/Address.sol";
import "../governance/extensions/GovernorCountingSimple.sol";
import "../governance/utils/GovernorMerkleVotes.sol";

/**
 * @title CommitRevealModule
 * @dev A module that implements a commit and reveal phase for time-scoped private voting to an underlying contest.
 */
contract CommitRevealModule is GovernorMerkleVotes {
    GovernorCountingSimple public underlyingContest;

    constructor(GovernorCountingSimple underlyingContest_, bytes32 submissionMerkleRoot_, bytes32 votingMerkleRoot_)
        GovernorMerkleVotes(submissionMerkleRoot_, votingMerkleRoot_)
    {
      underlyingContest = underlyingContest_;
    }

    // ability to commit

    // ability to reveal
}
