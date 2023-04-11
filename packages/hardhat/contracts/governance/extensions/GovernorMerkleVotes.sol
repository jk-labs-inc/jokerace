
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// ============ Imports ============

import { MerkleProof } from "../../utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof

/// @title GovernorMerkleVotes
contract GovernorMerkleVotes {

  /// ============ Immutable storage ============

  /// @notice ERC20-claimee inclusion root
  bytes32 public immutable merkleRoot;

  /// ============ Errors ============

  /// @notice Thrown if address/amount are not part of Merkle tree
  error NotInMerkle();

  /// ============ Constructor ============

  /// @notice Creates a new GovernorMerkleVotes contract
  /// @param _merkleRoot of claimees
  constructor(
    bytes32 _merkleRoot
  ) {
    merkleRoot = _merkleRoot; // Update root
  }

  /// ============ Functions ============

  /// @notice Allows checking of votes for an address
  /// @param addressToCheck address of claimee
  /// @param amount of votes to check that the claimee has
  /// @param proof merkle proof to prove address and amount are in tree
  function checkVotes(address addressToCheck, uint256 amount, bytes32[] calldata proof) external view returns (bool validVotes) {
    // Verify merkle proof, or revert if not in tree
    bytes32 leaf = keccak256(abi.encodePacked(addressToCheck, amount));
    bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
    if (!isValidLeaf) revert NotInMerkle();
    return true;
  }
}