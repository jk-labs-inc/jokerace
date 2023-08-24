import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@config/s3";
import { Recipient } from "lib/merkletree/generateMerkleTree";

const MERKLE_TREES_BUCKET = process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET as string;

interface LoadFileOptions {
  fileId: string;
}

interface SaveFileOptions {
  fileId: string;
  content: Recipient[];
}

/**
 * Loads a JSON file from the specified S3 bucket.
 *
 * @param options - object containing fileId and bucketName.
 * @returns - parsed JSON object.
 */
export const loadFileFromBucket = async ({ fileId }: LoadFileOptions): Promise<Recipient[] | null> => {
  try {
    const input = {
      Bucket: MERKLE_TREES_BUCKET,
      Key: fileId,
    };
    const command = new GetObjectCommand(input);
    const response = await s3.send(command);

    if (response.Body) {
      const dataString = await response.Body.transformToString("utf-8");
      return JSON.parse(dataString);
    }
    return null;
  } catch (error) {
    console.error(`Error loading file from bucket: ${error}`);
    throw new Error(`Failed to load file with ID ${fileId} from bucket ${MERKLE_TREES_BUCKET}`);
  }
};

/**
 * Saves a JSON object to the specified S3 bucket.
 *
 * @param options - object containing fileId, the JSON content, and bucketName.
 */
export const saveFileToBucket = async ({ fileId, content }: SaveFileOptions): Promise<void> => {
  try {
    const input = {
      Bucket: MERKLE_TREES_BUCKET,
      Key: fileId,
      Body: JSON.stringify(content),
      ContentType: "application/json",
    };
    const command = new PutObjectCommand(input);

    await s3.send(command);
  } catch (error) {
    console.error(`Error saving file to bucket: ${error}`);
    throw new Error(`Failed to save file with ID ${fileId} to bucket ${MERKLE_TREES_BUCKET}`);
  }
};
