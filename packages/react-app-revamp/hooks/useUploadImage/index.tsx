import { saveImageToBucket } from "lib/buckets";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type UploadService = "s3" | "arweave" | "ipfs";

type UploadImageStore = {
  uploadService: UploadService;
  setUploadService: (service: UploadService) => void;
  uploadImage: (file: File) => Promise<string | null>;
};

export const useUploadImageStore = create<UploadImageStore>((set, get) => ({
  uploadService: "s3",

  setUploadService: service => set({ uploadService: service }),

  uploadImage: async (file: File) => {
    const currentService = get().uploadService;
    const base64 = await fileToBase64(file);
    const fileId = uuidv4();

    switch (currentService) {
      case "s3":
        return saveImageToBucket({ fileId, type: file.type, content: file });
      case "arweave":
        // logic for arweave ( when implemented )
        return null;
      case "ipfs":
        // logic for IPFS ( when implemented )
        return null;
      default:
        throw new Error(`Unsupported service: ${currentService}`);
    }
  },
}));

/**
 * Convert a file object to its base64 string representation.
 * @param file - The file object to convert.
 * @returns A promise resolving to the file's base64 string representation.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
