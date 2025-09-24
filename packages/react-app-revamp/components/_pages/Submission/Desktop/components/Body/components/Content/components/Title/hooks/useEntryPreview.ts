import { verifyEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import { useEntryContractConfigStore } from "@components/_pages/Submission/hooks/useEntryContractConfig/store";
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
  const { contestAddress, contestChainId, contestAbi, contestVersion } = useEntryContractConfigStore(state => state);
  const { isLoading, isError } = useMetadataFields({
    address: contestAddress as `0x${string}`,
    chainId: contestChainId,
    abi: contestAbi,
    version: contestVersion,
  });

  const metadataFields = useMetadataStore(useShallow(state => state.fields));

  const { enabledPreview } =
    metadataFields.length > 0 ? verifyEntryPreviewPrompt(metadataFields[0].prompt) : { enabledPreview: null };

  const isEntryPreviewTitle = enabledPreview === EntryPreview.TITLE || enabledPreview === EntryPreview.IMAGE_AND_TITLE;

  return {
    isLoading,
    isError,
    isEntryPreviewTitle,
    enabledPreview,
  };
};
