import { keccak256, parseUnits, solidityKeccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

// Vote recipient addresses and scaled vote values
export interface Voter {
  address: string;
  numVotes: string;
}

export interface Proof {
  position: "left" | "right";
  data: Buffer;
}

export interface MerkleTreeVotingData {
  merkleTree: MerkleTree;
  merkleRoot: string;
  voters: Voter[];
}

/**
 * Setup vote recipients
 * @param {number} decimals of votes
 * @param {Record<string, number>} votesData address to vote claim mapping
 * @returns {VoteRecipient[]} array of vote recipients
 */
const setupVoteRecipients = (decimals: number, votesData: Record<string, number>): Voter[] => {
  const voters: Voter[] = [];

  // For each vote entry
  for (const [address, votes] of Object.entries(votesData)) {
    voters.push({
      address: address,
      numVotes: parseUnits(votes.toString(), decimals).toString(),
    });
  }

  return voters;
};

/**
 * Generate Merkle Tree leaf from address and numVotes
 * @param {string} address of vote recipient
 * @param {string} numVotes dedicated to the recipient
 * @returns {Buffer} Merkle Tree node
 */
const generateLeaf = (address: string, numVotes: string): Buffer => {
  return Buffer.from(solidityKeccak256(["address", "uint256"], [address, numVotes]).slice(2), "hex");
};

/**
 * Generate Merkle Tree from vote recipients
 * @param {VoteRecipient[]} recipients array of vote recipients
 * @returns {MerkleTree} merkle tree
 */
const createMerkleTree = (voters: Voter[]): MerkleTree => {
  return new MerkleTree(
    voters.map(({ address, numVotes }) => generateLeaf(address, numVotes)),
    keccak256,
    { sortPairs: true },
  );
};

/**
 * Main processing function
 * @param {number} decimals of votes
 * @param {Record<string, number>} votesData address to vote claim mapping
 * @returns {Promise<void>}
 */
export const createMerkleTreeFromVotes = (
  decimals: number,
  votesData: Record<string, number>,
): MerkleTreeVotingData => {
  const voters = setupVoteRecipients(decimals, votesData);
  const merkleTree = createMerkleTree(voters);
  const merkleRoot: string = merkleTree.getHexRoot();

  return {
    merkleTree,
    merkleRoot,
    voters,
  };
};

/**
 * Generate Merkle proof for a given address and number of votes
 * @param {MerkleTree} merkleTree The merkle tree instance
 * @param {string} address of vote recipient
 * @param {string} numVotes dedicated to the recipient
 * @returns {Proof[]} Array of objects containing a position property and a data property of type Buffer
 */
export const generateProof = (merkleTree: MerkleTree, address: string, numVotes: string): Proof[] => {
  const leaf = generateLeaf(address, numVotes);

  return merkleTree.getProof(leaf);
};
