import { keccak256, parseUnits, solidityKeccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

// Vote recipient addresses and scaled vote values
export interface Recipient {
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
  recipients: Recipient[];
}

/**
 * Setup vote recipients
 * @param {number} decimals of votes
 * @param {Record<string, number>} votesData address to vote claim mapping
 * @returns {VoteRecipient[]} array of vote recipients
 */
const setupVoteRecipients = (decimals: number, votesData: Record<string, number>): Recipient[] => {
  const recipients: Recipient[] = [];

  // For each vote entry
  for (const [address, votes] of Object.entries(votesData)) {
    recipients.push({
      address: address,
      numVotes: parseUnits(votes.toString(), decimals).toString(),
    });
  }

  return recipients;
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
const createMerkleTree = (recipients: Recipient[]): MerkleTree => {
  return new MerkleTree(
    recipients.map(({ address, numVotes }) => generateLeaf(address, numVotes)),
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
  decimals: number = 18,
  votesData: Record<string, number>,
): MerkleTreeVotingData => {
  const recipients = setupVoteRecipients(decimals, votesData);
  const merkleTree = createMerkleTree(recipients);
  const merkleRoot: string = merkleTree.getHexRoot();

  return {
    merkleTree,
    merkleRoot,
    recipients,
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
