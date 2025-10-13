import { useMemo } from "react";

interface UseSanitizedContentOptions {
  removeEntryPreviewTitle?: boolean;
}

export const useSanitizedContent = (
  content: string,
  options: UseSanitizedContentOptions = { removeEntryPreviewTitle: true },
): string => {
  return useMemo(() => {
    if (typeof document === "undefined") {
      return content;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    if (options.removeEntryPreviewTitle) {
      const titleParagraphs = tempDiv.querySelectorAll("p#entry-preview-title");
      titleParagraphs.forEach(p => p.remove());
    }

    return tempDiv.innerHTML;
  }, [content, options.removeEntryPreviewTitle]);
};
