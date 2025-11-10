import { verifyEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import useMetadataFields from "@hooks/useMetadataFields";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { useShallow } from "zustand/shallow";

interface UseEntryPreviewReturn {
  isLoading: boolean;
  isError: boolean;
  isEntryPreviewTitle: boolean;
  enabledPreview: EntryPreview | null;
}

export const useEntryPreview = (): UseEntryPreviewReturn => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { isLoading, isError } = useMetadataFields({
    address: contestConfig.address,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
    version: contestConfig.version,
  });

  const metadataFields = useMetadataStore(useShallow(state => state.fields));

  const { enabledPreview } =
    metadataFields.length > 0 ? verifyEntryPreviewPrompt(metadataFields[0].prompt) : { enabledPreview: null };

  const isEntryPreviewTitle =
    enabledPreview === EntryPreview.TITLE ||
    enabledPreview === EntryPreview.IMAGE_AND_TITLE ||
    enabledPreview === EntryPreview.TWEET_AND_TITLE;

  return {
    isLoading,
    isError,
    isEntryPreviewTitle,
    enabledPreview,
  };
};
