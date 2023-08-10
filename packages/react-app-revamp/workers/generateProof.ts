import { generateMerkleTree, generateProof, Recipient } from "lib/merkletree/generateMerkleTree";

interface MerkleTreeProofPayload {
  data: {
    address: string;
    numVotes: string;
  }[];
  address: string;
  numVotes: string;
}

self.onmessage = (event: MessageEvent<MerkleTreeProofPayload>) => {
  const { address, numVotes, data } = event.data;

  const dataRecord = data.reduce((acc: Record<string, number>, vote: Recipient) => {
    acc[vote.address] = Number(vote.numVotes);
    return acc;
  }, {});

  const merkleTree = generateMerkleTree(18, dataRecord).merkleTree;

  const proofs = generateProof(merkleTree, address, numVotes);

  postMessage({ proofs });
};
