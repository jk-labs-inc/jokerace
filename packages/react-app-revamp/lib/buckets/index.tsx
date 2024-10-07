import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { Recipient } from "lib/merkletree/generateMerkleTree";

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
    const response = await fetch(`/api/bucket/load?fileId=${encodeURIComponent(fileId)}`, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to load file from bucket");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading file from bucket: ${error}`);
    throw new Error(`Failed to load file with ID ${fileId}`);
  }
};

/**
 * Saves a JSON object to the specified S3 bucket.
 *
 * @param options - object containing fileId, the JSON content, and bucketName.
 */
export const saveFileToBucket = async ({ fileId, content }: SaveFileOptions): Promise<void> => {
  try {
    const response = await fetch("/api/bucket/save-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save file to bucket");
    }
  } catch (error) {
    console.error(`Error saving file to bucket: ${error}`);
    throw new Error(`Failed to save file with ID ${fileId} to bucket`);
  }
};

export const saveImageToBucket = async ({ fileId, type, file }: SaveImageOptions): Promise<string> => {
  toastLoading("Uploading image...", false);
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileId", fileId);
    formData.append("type", type);

    const response = await fetch("/api/bucket/save-image", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Invalid JSON response from server");
    }

    toastSuccess("Image uploaded successfully!");
    return data.url;
  } catch (error: any) {
    toastError("Failed to upload an image, please try again.");
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image with ID ${fileId}`);
  }
};
