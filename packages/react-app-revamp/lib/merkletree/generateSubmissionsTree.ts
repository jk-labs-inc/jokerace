import { utils } from "ethers";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

// Submitter address
export interface Submitter {
  address: string;
}

export interface MerkleTreeSubmissionsData {
  merkleTree: MerkleTree;
  merkleRoot: string;
  submitters: Submitter[];
}

/**
 * Generate Merkle Tree leaf from address
 * @param {string} address of submitter
 * @returns {Buffer} Merkle Tree node
 */
const generateLeaf = (address: string): Buffer => {
  const checksumAddress = utils.getAddress(address);
  return Buffer.from(solidityKeccak256(["address"], [checksumAddress]).slice(2), "hex");
};
/**
 * Generate Merkle Tree from submitters
 * @param {Submitter[]} submitters array of submitters
 * @returns {MerkleTree} merkle tree
 */
const createMerkleTree = (submitters: Submitter[]): MerkleTree => {
  return new MerkleTree(
    submitters.map(({ address }) => generateLeaf(address)),
    keccak256,
    { sortPairs: true },
  );
};

/**
 * Main processing function
 * @param {string[]} submitters
 * @returns {Promise<void>}
 */
export const createMerkleTreeFromAddresses = (submitters: Submitter[]): MerkleTreeSubmissionsData => {
  const merkleTree = createMerkleTree(submitters);
  const merkleRoot: string = merkleTree.getHexRoot();

  return {
    merkleTree,
    merkleRoot,
    submitters,
  };
};

/**
 * Generate Merkle proof for a given address
 * @param {MerkleTree} merkleTree The merkle tree instance
 * @param {string} address of submitter
 * @returns {string[]} Array of strings containing the Merkle proof or the Merkle root
 */
export const generateProof = (merkleTree: MerkleTree, address: string): string[] => {
  const checksumAddress = utils.getAddress(address);
  const leaf = generateLeaf(checksumAddress);

  // If the tree only contains one address
  if (merkleTree.getLeaves().length === 1) {
    // Return the Merkle root as a single-item array
    return [merkleTree.getHexRoot()];
  }

  // Otherwise return the proof as an array
  return merkleTree.getHexProof(leaf);
};
