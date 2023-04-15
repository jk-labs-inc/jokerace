
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// ============ Imports ============

import { MerkleProof } from "@openzeppelin/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof

/// @title GovernorMerkleVotes
abstract contract GovernorMerkleVotes {

  /// ============ Immutable storage ============

  /// @notice ERC20-claimee inclusion root
  bytes32 public immutable submissionMerkleRoot;
  bytes32 public immutable votingMerkleRoot;

  /// ============ Errors ============

  /// @notice Thrown if address/amount are not part of Merkle tree
  error NotInMerkle();

  /// ============ Constructor ============

  /// @notice Creates a new GovernorMerkleVotes contract
  /// @param _submissionMerkleRoot of claimees
  /// @param _votingMerkleRoot of claimees
  constructor(
    bytes32 _submissionMerkleRoot,
    bytes32 _votingMerkleRoot
  ) {
    submissionMerkleRoot = _submissionMerkleRoot; // Update root
    votingMerkleRoot = _votingMerkleRoot; // Update root
  }

  /// ============ Functions ============

  /// @notice Allows checking of proofs for an address
  /// @param addressToCheck address of claimee
  /// @param amount to check that the claimee has
  /// @param proof merkle proof to prove address and amount are in tree
  function checkProof(address addressToCheck, uint256 amount, bytes32[] calldata proof, bool voting) public view returns (bool verified) {
    // Verify merkle proof, or revert if not in tree
    bytes32 leaf = keccak256(abi.encodePacked(addressToCheck, amount));
    bool isValidLeaf = voting ? MerkleProof.verify(proof, votingMerkleRoot, leaf) : MerkleProof.verify(proof, submissionMerkleRoot, leaf);
    if (!isValidLeaf) revert NotInMerkle();
    return true;
  }
}