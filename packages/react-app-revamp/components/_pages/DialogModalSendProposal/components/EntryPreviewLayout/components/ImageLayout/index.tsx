import ImageUpload from "@components/UI/ImageUpload";
import { FC } from "react";

interface DialogModalSendProposalImageLayoutProps {
  onChange?: (imageUrl: string) => void;
}

const DialogModalSendProposalEntryPreviewImageLayout: FC<DialogModalSendProposalImageLayoutProps> = ({ onChange }) => {
  const onImageLoadHandler = (imageUrl: string) => {
    onChange?.(imageUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px] font-bold">image upload</p>
      <ImageUpload onImageLoad={onImageLoadHandler} />
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewImageLayout;
