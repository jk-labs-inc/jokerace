import { Recipient } from "lib/merkletree/generateMerkleTree";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@config/s3";

export const MERKLE_TREES_BUCKET = process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET as string;

export interface LoadFileOptions {
  fileId: string;
}

const loadFileFromBucket = async ({ fileId }: LoadFileOptions): Promise<Recipient[] | null> => {
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

self.onmessage = async event => {
  const { fileId } = event.data;

  try {
    const data = await loadFileFromBucket({ fileId });
    postMessage({ data });
  } catch (error) {
    postMessage({ error });
  }
};
