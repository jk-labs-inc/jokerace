import { EntryPreview } from "@hooks/useDeployContest/store";

export const isEntryPreviewPrompt = (prompt: string): boolean =>
  Object.values(EntryPreview).some(
    value =>
      prompt.startsWith(value) &&
      (prompt.endsWith("_DESCRIPTION_ENABLED") || prompt.endsWith("_DESCRIPTION_NOT_ENABLED")),
  );
