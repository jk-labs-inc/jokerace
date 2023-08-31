import { uploadToImgur } from "lib/image/imgur";
import { create } from "zustand";

type UploadService = "imgur" | "arweave" | "ipfs";

type UploadImageStore = {
  uploadService: UploadService;
  setUploadService: (service: UploadService) => void;
  uploadImage: (file: File) => Promise<string | null>;
};

export const useUploadImageStore = create<UploadImageStore>((set, get) => ({
  uploadService: "imgur",

  setUploadService: service => set({ uploadService: service }),

  uploadImage: async (file: File) => {
    const currentService = get().uploadService;
    const base64Image = await fileToBase64(file);
    const base64Data = base64Image.split(",")[1];

    switch (currentService) {
      case "imgur":
        return uploadToImgur(base64Data);
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
