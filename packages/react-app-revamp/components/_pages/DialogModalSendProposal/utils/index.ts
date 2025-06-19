import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";

export const DESCRIPTION_ENABLED = "_DESCRIPTION_ENABLED";
export const DESCRIPTION_NOT_ENABLED = "_DESCRIPTION_NOT_ENABLED";

export const isEntryPreviewPrompt = (prompt: string): boolean =>
  Object.values(EntryPreview).some(
    value =>
      prompt.startsWith(value) && (prompt.endsWith(DESCRIPTION_ENABLED) || prompt.endsWith(DESCRIPTION_NOT_ENABLED)),
  );

export const verifyEntryPreviewPrompt = (
  prompt: string,
): {
  enabledPreview: EntryPreview | null;
  isDescriptionEnabled: boolean;
} => {
  const enabledPreview = Object.values(EntryPreview).find(preview => prompt.startsWith(preview)) || null;
  const isDescriptionEnabled = prompt.endsWith(DESCRIPTION_ENABLED);

  return {
    enabledPreview,
    isDescriptionEnabled,
  };
};
