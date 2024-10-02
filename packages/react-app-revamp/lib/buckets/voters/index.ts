import { loadFileFromBucket } from "lib/buckets";

/**
 * Get all voters for a given voting merkle root from S3 bucket
 * @param votingMerkleRoot
 * @returns Array of voters
 */
export async function getVoters(votingMerkleRoot: string) {
  try {
    const votingMerkleTreeData = await loadFileFromBucket({ fileId: votingMerkleRoot });
    return {
      voters: votingMerkleTreeData || [],
    };
  } catch (error) {
    throw new Error("Error while fetching voter data");
  }
}
