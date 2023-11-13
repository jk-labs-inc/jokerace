import { truncateText } from "@helpers/truncate";
import { useContestStore } from "@hooks/useContest/store";
import { FC, useEffect, useRef, useState } from "react";
import ContestPromptPageLegacyLayout from "./Layout/Legacy";
import ContestPromptPageV3Layout from "./Layout/V3";

interface ContestPromptPageProps {
  prompt: string;
}

const MAX_LENGTH = 100;

const ContestPromptPage: FC<ContestPromptPageProps> = ({ prompt }) => {
  const { isV3 } = useContestStore(state => state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contestType, contestTitle, contestSummary, contestEvaluate] = prompt.split("|");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [contentRef, isExpanded]);

  const shouldDisplayReadMore = () => {
    if (!isV3) {
      return prompt.length > MAX_LENGTH;
    }

    const combinedContentLength = contestSummary.length + (contestEvaluate?.length || 0);
    return combinedContentLength > MAX_LENGTH;
  };

  const getSummaryContent = () => {
    return isExpanded ? contestSummary : truncateText(contestSummary, MAX_LENGTH);
  };

  const getEvaluateContent = () => {
    if (!contestEvaluate) {
      return "";
    }

    return shouldDisplayEvaluate() ? contestEvaluate : "";
  };

  const shouldDisplayEvaluate = () => {
    return !!contestEvaluate && (isExpanded || contestSummary.length <= MAX_LENGTH);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isV3 ? (
        <ContestPromptPageV3Layout
          contestTitle={contestTitle}
          contestType={contestType}
          summaryContent={getSummaryContent()}
          evaluateContent={getEvaluateContent()}
          isExpanded={isExpanded}
          maxHeight={maxHeight}
          contentRef={contentRef}
          displayReadMore={shouldDisplayReadMore()}
          shouldDisplayEvaluate={shouldDisplayEvaluate()}
          handleToggle={toggleExpand}
        />
      ) : (
        <ContestPromptPageLegacyLayout
          prompt={prompt}
          isExpanded={isExpanded}
          maxHeight={maxHeight}
          contentRef={contentRef}
          displayReadMore={shouldDisplayReadMore()}
          handleToggle={toggleExpand}
        />
      )}
    </>
  );
};

export default ContestPromptPage;
