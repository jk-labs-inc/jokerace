import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";

export const getContestImageUrl = (contestPrompt: string | null | undefined): string | null => {
  if (!contestPrompt) return null;
  const { contestImageUrl } = parsePrompt(contestPrompt);
  return contestImageUrl || null;
};
