import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { useState } from "react";
import CreateGradientTitle from "../GradientTitle";

const CreateUploadImage = () => {
  const { prompt, setPrompt } = useDeployContestStore(state => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    upload?: string;
    url?: string;
  }>({});
  const [isNetworkError, setIsNetworkError] = useState(false);
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
      setPrompt({
        ...prompt,
        imageUrl: "",
      });
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
        setPrompt({
          ...prompt,
          imageUrl: "",
        });
        return;
      }

      setPrompt({
        ...prompt,
        imageUrl: imageUrl,
      });
    } catch (error) {
      setIsNetworkError(true);
      setPrompt({
        ...prompt,
        imageUrl: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onUrlSelectHandler = (url: string | null) => {
    if (!url) {
      setValidationError({});
      setPrompt({
        ...prompt,
        imageUrl: "",
      });
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
        setPrompt({
          ...prompt,
          imageUrl: "",
        });
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

    setPrompt({
      ...prompt,
      imageUrl: url,
    });
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <div className="flex flex-col gap-4">
      <CreateGradientTitle additionalInfo="recommended">preview image</CreateGradientTitle>
      <ImageUpload
        onFileSelect={onFileSelectHandler}
        onUrlSelect={onUrlSelectHandler}
        isLoading={isLoading}
        validationError={validationError}
        isNetworkError={isNetworkError}
        initialImageUrl={prompt.imageUrl}
      />
    </div>
  );
};

export default CreateUploadImage;
