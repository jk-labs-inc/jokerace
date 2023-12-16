// SPDX-License-Identifier: AGPL-3.0-only
// Forked from https://github.com/Anish-Agnihotri/merkle-airdrop-starter/blob/master/contracts/src/MerkleClaimERC20.sol
pragma solidity ^0.8.19;

/// ============ Imports ============

import {MerkleProof} from "@openzeppelin/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof

/// @title GovernorMerkleVotes
abstract contract GovernorMerkleVotes {
    /// ============ Immutable storage ============

    /// @notice Participant inclusion roots
    bytes32 public submissionMerkleRoot;
    bytes32 public votingMerkleRoot;

    /// ============ Errors ============

    /// @notice Thrown if address/amount are not part of Merkle tree
    error NotInMerkle();

    /// ============ Constructor ============

    /// @notice Creates a new GovernorMerkleVotes contract
    /// @param _submissionMerkleRoot of participants
    /// @param _votingMerkleRoot of participants
    constructor(bytes32 _submissionMerkleRoot, bytes32 _votingMerkleRoot) {
        submissionMerkleRoot = _submissionMerkleRoot; // Update root
        votingMerkleRoot = _votingMerkleRoot; // Update root
    }

    /// ============ Functions ============

    /// @notice Allows checking of proofs for an address
    /// @param addressToCheck address of participant
    /// @param amount to check that the participant has the correct amount
    /// @param proof merkle proof to prove address and amount are in tree
    /// @param voting true if this is for a voting proof, false if this is for a submission proof
    function checkProof(address addressToCheck, uint256 amount, bytes32[] calldata proof, bool voting)
        public
        view
        returns (bool verified)
    {
        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(addressToCheck, amount));
        bool isValidLeaf = voting
            ? MerkleProof.verify(proof, votingMerkleRoot, leaf)
            : MerkleProof.verify(proof, submissionMerkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();
        return true;
    }
}
