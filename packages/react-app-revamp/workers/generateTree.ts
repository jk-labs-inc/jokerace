import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";

self.onmessage = event => {
  const { votesDataRecord, submissionsDataRecord } = event.data;
  const votingMerkleTree = generateMerkleTree(18, votesDataRecord).merkleTree;
  const submissionMerkleTree = generateMerkleTree(18, submissionsDataRecord).merkleTree;

  console.log("Worker generated trees", { submissionMerkleTree, votingMerkleTree });
  postMessage({ submissionMerkleTree, votingMerkleTree });
};
