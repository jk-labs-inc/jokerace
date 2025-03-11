import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { FC, useState } from "react";

interface DialogModalSendProposalImageLayoutProps {
  onChange?: (imageUrl: string) => void;
}

const DialogModalSendProposalEntryPreviewImageLayout: FC<DialogModalSendProposalImageLayoutProps> = ({ onChange }) => {
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    upload?: string;
    url?: string;
  }>({});
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
  const { uploadImage } = useUploadImageStore();

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setValidationError({
        ...validationError,
        upload: "Please upload a valid image/gif file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
      });
      return false;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setValidationError({
        ...validationError,
        upload: "File size should be less than 20MB",
      });
      return false;
    }

    setValidationError({
      ...validationError,
      upload: undefined,
    });
    return true;
  };

  const onFileSelectHandler = async (file: File | null) => {
    setIsNetworkError(false);
    setValidationError({});

    if (!file) {
      onChange?.("");
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await uploadImageToServer(file);

      if (!imageUrl) {
        setIsNetworkError(true);
        onChange?.("");
        return;
      }

      setUploadSuccess(true);
      onChange?.(imageUrl);
    } catch (error) {
      setIsNetworkError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onUrlSelectHandler = (url: string | null) => {
    if (!url) {
      setValidationError({});
      onChange?.("");
      return;
    }

    try {
      new URL(url);

      const fileExtension = url.split(".").pop()?.toLowerCase();
      const validImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "jfif"];

      if (!fileExtension || !validImageExtensions.includes(fileExtension)) {
        setValidationError({
          ...validationError,
          url: "URL must point to a valid image file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
        });
        onChange?.("");
        return;
      }

      setValidationError({});
    } catch (e) {
      setValidationError({
        ...validationError,
        url: "Please enter a valid URL",
      });
      return;
    }

    onChange?.(url);
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
        onUrlSelect={onUrlSelectHandler}
        isSuccess={uploadSuccess}
        isLoading={isLoading}
        validationError={validationError}
        isNetworkError={isNetworkError}
      />
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageLayout;
