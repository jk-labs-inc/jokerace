import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

// Submitter address
export interface Submitter {
  address: string;
}

export interface Proof {
  position: "left" | "right";
  data: Buffer;
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
  return Buffer.from(solidityKeccak256(["address"], [address]).slice(2), "hex");
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
 * @returns {Proof[]} Array of objects containing a position property and a data property of type Buffer
 */
export const generateProof = (merkleTree: MerkleTree, address: string): Proof[] => {
  const leaf = generateLeaf(address);

  return merkleTree.getProof(leaf);
};
