interface ParsedPrompt {
  contestType: string;
  contestTitle: string;
  contestSummary: string;
  contestEvaluate: string;
  contestContactDetails: string;
}

export const parsePrompt = (prompt: string): ParsedPrompt => {
  const segments = prompt.split("|");
  const defaultPrompt: ParsedPrompt = {
    contestType: "",
    contestTitle: "",
    contestSummary: "",
    contestEvaluate: "",
    contestContactDetails: "",
  };

  if (segments.length === 3) {
    // new format without title
    return { ...defaultPrompt, contestType: segments[0], contestSummary: segments[1], contestEvaluate: segments[2] };
  } else if (segments.length === 4) {
    // new format without title, but with contact details
    return {
      ...defaultPrompt,
      contestType: segments[0],
      contestSummary: segments[1],
      contestEvaluate: segments[2],
      contestContactDetails: segments[3],
    };
  } else if (segments.length === 5) {
    // old format with all fields
    return {
      contestType: segments[0],
      contestTitle: segments[1],
      contestSummary: segments[2],
      contestEvaluate: segments[3],
      contestContactDetails: segments[4],
    };
  } else {
    console.error("Unexpected number of segments in prompt");
    return defaultPrompt;
  }
};
