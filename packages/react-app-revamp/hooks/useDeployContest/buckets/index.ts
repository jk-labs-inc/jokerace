import { isR2Configured } from "@helpers/r2";
import { loadFileFromBucket, saveFileToBucket } from "lib/buckets";
import { formatRecipients } from "../helpers";
import { VotingMerkle, SubmissionMerkle } from "../types";

export async function saveFilesToBucket(votingMerkle: VotingMerkle | null, submissionMerkle: SubmissionMerkle | null) {
  if (!isR2Configured) {
    throw new Error("R2 is not configured");
  }

  const tasks: Promise<void>[] = [];

  if (votingMerkle && !(await checkExistingFileInBucket(votingMerkle.merkleRoot))) {
    tasks.push(
      saveFileToBucket({
        fileId: votingMerkle.merkleRoot,
        content: formatRecipients(votingMerkle.voters),
      }),
    );
  }

  if (submissionMerkle && !(await checkExistingFileInBucket(submissionMerkle.merkleRoot))) {
    tasks.push(
      saveFileToBucket({
        fileId: submissionMerkle.merkleRoot,
        content: formatRecipients(submissionMerkle.submitters),
      }),
    );
  }

  await Promise.all(tasks);
}

async function checkExistingFileInBucket(fileId: string): Promise<boolean> {
  try {
    const existingData = await loadFileFromBucket({ fileId });
    return !!(existingData && existingData.length > 0);
  } catch (e) {
    return false;
  }
}
