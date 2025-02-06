import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { useState } from "react";
import CreateGradientTitle from "../GradientTitle";

const CreateUploadImage = () => {
  const { prompt, setPrompt } = useDeployContestStore(state => state);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
      setPrompt({
        ...prompt,
        imageUrl: "",
      });
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    try {
      const imageUrl = await uploadImageToServer(file);

      setUploadSuccess(true);
      setUploadError("");
      setPrompt({
        ...prompt,
        imageUrl: imageUrl,
      });
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <div className="flex flex-col gap-4">
      <CreateGradientTitle additionalInfo="recommended">preview image</CreateGradientTitle>
      <ImageUpload onFileSelect={onFileSelectHandler} isSuccess={uploadSuccess} initialImageUrl={prompt.imageUrl} />
      {uploadError && <p className="text-[12px] text-negative-11 font-bold">{uploadError}</p>}
    </div>
  );
};

export default CreateUploadImage;
