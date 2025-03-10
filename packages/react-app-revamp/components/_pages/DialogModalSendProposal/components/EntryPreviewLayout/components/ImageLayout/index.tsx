import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { FC, useState } from "react";

interface DialogModalSendProposalImageLayoutProps {
  onChange?: (imageUrl: string) => void;
}

const DialogModalSendProposalEntryPreviewImageLayout: FC<DialogModalSendProposalImageLayoutProps> = ({ onChange }) => {
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const { uploadImage } = useUploadImageStore();

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setUploadError("Please upload a valid image/gif file (JPEG, JPG, PNG, JFIF, GIF, or WebP)");
      return false;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size should be less than 20MB");
      return false;
    }

    return true;
  };

  const onFileSelectHandler = async (file: File | null) => {
    if (!file) {
      setUploadError("");
      setIsNetworkError(false);
      onChange?.("");
      return;
    }

    if (!validateFile(file)) {
      setIsNetworkError(false);
      return;
    }

    try {
      console.log("uploading image");
      const imageUrl = await uploadImageToServer(file);

      setUploadSuccess(true);
      setUploadError("");
      onChange?.(imageUrl);
    } catch (error) {
      console.log("error", error);
      setIsNetworkError(true);
      setUploadError("Failed to upload image. Please try again.");
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px] font-bold">image</p>
      <ImageUpload
        onFileSelect={onFileSelectHandler}
        isSuccess={uploadSuccess}
        errorMessage={uploadError}
        isNetworkError={isNetworkError}
      />
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageLayout;
