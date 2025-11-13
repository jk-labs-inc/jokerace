import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateContestEntriesPreviewPickerOptionsContainer from "./components/Container";
import { useShallow } from "zustand/shallow";
import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";

const CreateContestEntriesPreviewPickerOptions = () => {
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(
    useShallow(state => ({
      entryPreviewConfig: state.entryPreviewConfig,
      setEntryPreviewConfig: state.setEntryPreviewConfig,
    })),
  );

  const handleImageOptionClick = () => {
    setEntryPreviewConfig({ ...entryPreviewConfig, preview: EntryPreview.IMAGE });
  };

  const handleTweetsOptionClick = () => {
    setEntryPreviewConfig({ ...entryPreviewConfig, preview: EntryPreview.TWEET });
  };

  return (
    <div className="flex items-center gap-4 md:gap-14">
      <CreateContestEntriesPreviewPickerOptionsContainer
        key="image"
        title="image"
        isActive={entryPreviewConfig.preview === EntryPreview.IMAGE}
        imageSrc="/create-flow/image-preview.svg"
        onClick={handleImageOptionClick}
      />
      <CreateContestEntriesPreviewPickerOptionsContainer
        key="tweets"
        title="tweets"
        isActive={entryPreviewConfig.preview === EntryPreview.TWEET}
        imageSrc="/create-flow/tweet-preview.png"
        onClick={handleTweetsOptionClick}
      />
    </div>
  );
};

export default CreateContestEntriesPreviewPickerOptions;
