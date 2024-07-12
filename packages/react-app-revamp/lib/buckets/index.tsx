import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { s3 } from "@config/s3";
import { Recipient } from "lib/merkletree/generateMerkleTree";

const MERKLE_TREES_BUCKET = process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET as string;
const IMAGE_UPLOAD_BUCKET = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET as string;

const IMAGE_PUBLIC_URL = "https://images.jokerace.io";

interface LoadFileOptions {
  fileId: string;
}

interface SaveFileOptions {
  fileId: string;
  content: Recipient[];
}

interface SaveImageOptions {
  fileId: string;
  type: string;
  file: File;
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

export const saveImageToBucket = async ({ fileId, type, file }: SaveImageOptions): Promise<string> => {
  toastLoading("Uploading image...", false);
  try {
    // Upload original image
    const input = {
      Bucket: IMAGE_UPLOAD_BUCKET,
      Key: fileId,
      Body: file,
      ContentType: type,
    };

    const command = new PutObjectCommand(input);
    await s3.send(command);

    const originalUrl = `${IMAGE_PUBLIC_URL}/${fileId}`;

    // Call server-side route to handle resizing
    const resizeResponse = await fetch("/api/resize-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!resizeResponse.ok) {
      throw new Error(`Failed to resize image: ${resizeResponse.status} ${resizeResponse.statusText}`);
    }

    const resizeData = await resizeResponse.json();

    // Upload resized images
    for (const [size, base64Image] of Object.entries(resizeData.resizedImages)) {
      const resizedBuffer = Buffer.from(base64Image as string, "base64");
      const resizedInput = {
        Bucket: IMAGE_UPLOAD_BUCKET,
        Key: `${fileId}-${size}`,
        Body: resizedBuffer,
        ContentType: resizeData.contentType,
      };

      const resizedCommand = new PutObjectCommand(resizedInput);
      await s3.send(resizedCommand);
    }

    toastSuccess("Image uploaded successfully!");
    return originalUrl;
  } catch (error: any) {
    toastError("Failed to upload an image, please try again.");
    throw new Error(`Failed to upload image with ID ${fileId} to bucket ${IMAGE_UPLOAD_BUCKET}`);
  }
};

/**
 * Fetches voter or submitter data from S3 bucket using web worker
 * @param fileId
 * @returns Voter or submitter data from S3 bucket
 */
export async function fetchDataFromBucket(fileId: string): Promise<Recipient[] | null> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("/workers/fetchDataFromBucket", import.meta.url));

    worker.onmessage = event => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.data);
      }
    };

    worker.onerror = error => {
      reject(error);
    };

    worker.postMessage({ fileId });
  });
}
