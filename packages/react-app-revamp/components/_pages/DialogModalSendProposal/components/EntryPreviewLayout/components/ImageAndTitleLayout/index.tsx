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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    upload?: string;
    url?: string;
  }>({});
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
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

    if (!file) {
      setValidationError({});
      setImageUrl("");
      updateCombinedValue("", inputValue);
      return;
    }

    const isValid = validateFile(file);

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const newImageUrl = await uploadImageToServer(file);
      if (!newImageUrl) {
        setIsNetworkError(true);
        setImageUrl("");
        updateCombinedValue("", inputValue);
        return;
      }

      setImageUrl(newImageUrl);
      updateCombinedValue(newImageUrl, inputValue);
    } catch (error) {
      setIsNetworkError(true);
      setImageUrl("");
      updateCombinedValue("", inputValue);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageToServer = async (file: File | null): Promise<string> => {
    if (!file) return "";

    const img = await uploadImage(file);
    return img ?? "";
  };

  const onUrlSelectHandler = (url: string | null) => {
    if (!url) {
      setValidationError({});
      setImageUrl("");
      updateCombinedValue("", inputValue);
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
        setImageUrl("");
        updateCombinedValue("", inputValue);
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

    setImageUrl(url);
    updateCombinedValue(url, inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
        <ImageUpload
          onFileSelect={onFileSelectHandler}
          isLoading={isLoading}
          validationError={validationError}
          isNetworkError={isNetworkError}
          onUrlSelect={onUrlSelectHandler}
          initialImageUrl={imageUrl}
        />
      </div>
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageAndTitleLayout;
