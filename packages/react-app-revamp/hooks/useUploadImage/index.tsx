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
    const fileId = uuidv4();

    switch (currentService) {
      case "s3":
        return saveImageToBucket({ fileId, type: file.type, file: file });
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
