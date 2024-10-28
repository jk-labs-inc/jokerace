import { Editor } from "@tiptap/react";
import { FC } from "react";
import DialogModalSendProposalEditor from "../../../Editor";

interface DialogModalSendProposalEntryPreviewAdditionalDescriptionLayoutProps {
  editorProposal: Editor | null;
  isDragging?: boolean;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const DialogModalSendProposalEntryPreviewAdditionalDescriptionLayout: FC<
  DialogModalSendProposalEntryPreviewAdditionalDescriptionLayoutProps
> = ({ editorProposal, isDragging, handleDrop, handleDragOver, handleDragLeave }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-bold text-neutral-11">
        additional description <span className="font-normal">(optional)</span>
      </p>
      <DialogModalSendProposalEditor
        editorProposal={editorProposal}
        isDragging={isDragging}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
      />
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewAdditionalDescriptionLayout;
