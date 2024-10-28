import ImageUpload from "@components/UI/ImageUpload";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { FC, useState } from "react";

interface DialogModalSendProposalImageLayoutProps {
  onChange?: (imageUrl: string) => void;
}

const DialogModalSendProposalEntryPreviewImageLayout: FC<DialogModalSendProposalImageLayoutProps> = ({ onChange }) => {
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const { uploadImage } = useUploadImageStore();

  const onFileSelectHandler = async (file: File) => {
    // check if the file is an image or gif
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image or GIF file.");
      return;
    }

    try {
      // use your custom upload function here
      const imageUrl = await uploadImageToServer(file);

      setUploadSuccess(true);
      setUploadError("");
      onChange?.(imageUrl);
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    }
  };

  // replace this with your actual upload function
  const uploadImageToServer = async (file: File): Promise<string> => {
    // implement your image upload logic here
    // this should return the URL of the uploaded image
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px] font-bold">image</p>
      <ImageUpload onFileSelect={onFileSelectHandler} isSuccess={uploadSuccess} />
      {uploadError && <p className="text-[12px] text-negative-11 font-bold">{uploadError}</p>}
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageLayout;
