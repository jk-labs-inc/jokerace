import { fetchDataFromBucket } from "..";

/**
 * Get all submitters for a given submission merkle root from S3 bucket
 * @param submissionMerkleRoot
 * @returns Array of submitters
 */
export async function getSubmitters(submissionMerkleRoot: string) {
  try {
    const submissionMerkleTreeData = await fetchDataFromBucket(submissionMerkleRoot);
    return {
      submitters: submissionMerkleTreeData || [],
    };
  } catch (error) {
    throw new Error("Error while fetching submitter data");
  }
}
