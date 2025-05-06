import { verifyEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import { EntryPreview } from "@hooks/useDeployContest/store";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { Editor } from "@tiptap/react";
import { FC } from "react";
import DialogModalSendProposalEntryPreviewAdditionalDescriptionLayout from "./components/AdditionalDescriptionLayout";
import ImageLayout from "./components/ImageLayout";
import TitleLayout from "./components/TitleLayout";
import TweetLayout from "./components/TweetLayout";
import ImageAndTitleLayout from "./components/ImageAndTitleLayout";

interface DialogModalSendProposalEntryPreviewLayoutsProps {
  entryPreviewLayout: string;
  editorProposal: Editor | null;
  isDragging?: boolean;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const DialogModalSendProposalEntryPreviewLayout: FC<DialogModalSendProposalEntryPreviewLayoutsProps> = ({
  entryPreviewLayout,
  editorProposal,
  isDragging,
  handleDrop,
  handleDragOver,
  handleDragLeave,
}) => {
  const { enabledPreview, isDescriptionEnabled } = verifyEntryPreviewPrompt(entryPreviewLayout);
  const { setInputValue } = useMetadataStore();

  const handleMetadataFieldChange = (value: string) => {
    // always set the first input value ( index = 0 )
    setInputValue(0, value);
  };

  const renderLayout = () => {
    switch (enabledPreview) {
      case EntryPreview.TITLE:
        return <TitleLayout onChange={handleMetadataFieldChange} />;
      case EntryPreview.IMAGE:
        return <ImageLayout onChange={handleMetadataFieldChange} />;
      case EntryPreview.IMAGE_AND_TITLE:
        return <ImageAndTitleLayout onChange={handleMetadataFieldChange} />;
      case EntryPreview.TWEET:
        return <TweetLayout onChange={handleMetadataFieldChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {renderLayout()}
      {isDescriptionEnabled && (
        <DialogModalSendProposalEntryPreviewAdditionalDescriptionLayout
          editorProposal={editorProposal}
          isDragging={isDragging}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
        />
      )}
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewLayout;
