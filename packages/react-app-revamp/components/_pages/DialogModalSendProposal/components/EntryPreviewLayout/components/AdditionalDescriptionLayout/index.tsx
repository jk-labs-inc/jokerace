import { Editor } from "@tiptap/react";
import { FC } from "react";
import DialogModalSendProposalEditor from "../../../Editor";
import GradientText from "@components/UI/GradientText";
import CreateGradientTitle from "@components/_pages/Create/components/GradientTitle";

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
      <CreateGradientTitle textSize="small" additionalInfo="optional">
        additional description
      </CreateGradientTitle>
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
