import { RefObject } from "react";

interface ContentSection {
  id: string;
  content: string | undefined;
}

interface BreakpointParams {
  elementRef: RefObject<HTMLElement>;
  shouldShowReadMore: boolean;
  isExpanded: boolean;
  maxVisibleLines: number;
  sections: ContentSection[];
}

interface BreakpointResult {
  section: string;
  lines: number;
}

/**
 * calculates which section to break at and how many lines to show
 */
export const calculateContentBreakpoint = ({
  elementRef,
  shouldShowReadMore,
  isExpanded,
  maxVisibleLines,
  sections,
}: BreakpointParams): BreakpointResult | null => {
  if (!shouldShowReadMore || isExpanded || !elementRef.current) return null;

  let accumulatedLines = 0;
  const tempElements: HTMLDivElement[] = [];

  // process each section in order
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section.content) continue;

    // create a temporary element to measure height
    const tempElement = document.createElement("div");
    tempElement.innerHTML = section.content;
    elementRef.current.appendChild(tempElement);
    tempElements.push(tempElement);

    // calculate lines for this section
    const sectionLines = Math.ceil(tempElement.offsetHeight / 24);
    const newTotalLines = accumulatedLines + sectionLines;

    // if adding this section exceeds max lines, we found our breakpoint
    if (newTotalLines >= maxVisibleLines) {
      // clean up all temp elements
      tempElements.forEach(el => elementRef.current?.removeChild(el));

      // if this is the first section and it already exceeds max lines
      if (i === 0) {
        return { section: section.id, lines: maxVisibleLines };
      }

      // otherwise break at this section with remaining lines
      return {
        section: section.id,
        lines: maxVisibleLines - accumulatedLines,
      };
    }

    // update accumulated lines for next iteration
    accumulatedLines = newTotalLines;
  }

  // clean up all temp elements
  tempElements.forEach(el => elementRef.current?.removeChild(el));

  return null;
};
