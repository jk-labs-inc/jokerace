import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface DialogModalSendProposalImageAndTitleLayoutProps {
  onChange?: (value: string) => void;
}

const MAX_IMAGE_TITLE_LENGTH = 32;

const DialogModalSendProposalEntryPreviewImageAndTitleLayout: FC<DialogModalSendProposalImageAndTitleLayoutProps> = ({
  onChange,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isExceeded, setIsExceeded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const { uploadImage } = useUploadImageStore();

  const updateCombinedValue = (newImageUrl: string = imageUrl, newInputValue: string = inputValue) => {
    // if both values are empty, return empty string
    if (!newImageUrl || !newInputValue) {
      onChange?.("");
      return;
    }

    // sanitize values - empty strings if undefined/null
    const sanitizedImageUrl = newImageUrl?.trim() || "";
    const sanitizedTitle = newInputValue?.trim() || "";

    const combinedValue = `JOKERACE_IMG=${sanitizedImageUrl}&JOKERACE_IMG_TITLE=${sanitizedTitle}`;
    onChange?.(combinedValue);
  };

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

  const onFileSelectHandler = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    try {
      const newImageUrl = await uploadImageToServer(file);
      // if upload fails or returns empty string
      if (!newImageUrl) {
        setUploadError("Failed to get image URL");
        setImageUrl("");
        updateCombinedValue("", inputValue);
        return;
      }

      setImageUrl(newImageUrl);
      setUploadSuccess(true);
      setUploadError("");
      updateCombinedValue(newImageUrl, inputValue);
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
      setImageUrl("");
      updateCombinedValue("", inputValue);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    setIsExceeded(value.length >= MAX_IMAGE_TITLE_LENGTH);
    updateCombinedValue(imageUrl, value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11">title</p>
        <div className={`bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"} `}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="text-[16px] bg-secondary-1 outline-none rounded-[16px] placeholder-neutral-10 w-full h-12 indent-4 focus:outline-none"
            placeholder="this is my entry..."
            maxLength={MAX_IMAGE_TITLE_LENGTH}
          />
        </div>
        {isExceeded && <p className="text-negative-11 text-[12px] font-bold">maximum character limit reached!</p>}
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-neutral-11 text-[16px] font-bold">image</p>
        <ImageUpload onFileSelect={onFileSelectHandler} isSuccess={uploadSuccess} />
        {uploadError && <p className="text-[12px] text-negative-11 font-bold">{uploadError}</p>}
      </div>
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageAndTitleLayout;
