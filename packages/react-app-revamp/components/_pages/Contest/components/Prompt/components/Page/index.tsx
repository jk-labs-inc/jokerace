import { truncateText } from "@helpers/truncate";
import { useContestStore } from "@hooks/useContest/store";
import { FC, useState } from "react";
import ContestPromptPageLegacyLayout from "./components/Layout/Legacy";
import ContestPromptPageV3Layout from "./components/Layout/V3";

interface ContestPromptPageProps {
  prompt: string;
}

const MAX_LENGTH = 200;

const ContestPromptPage: FC<ContestPromptPageProps> = ({ prompt }) => {
  const { isV3 } = useContestStore(state => state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contestType, contestTitle, contestSummary, contestEvaluate, contestContactDetails] = prompt.split("|");

  const shouldDisplayReadMore = () => {
    if (!isV3) {
      return prompt.length > MAX_LENGTH;
    }

    const combinedContentLength =
      contestSummary.length + (contestEvaluate?.length || 0) + (contestContactDetails?.length || 0);
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

  const getContactDetails = () => {
    return contestContactDetails || "";
  };

  const shouldDisplayContactDetails = () => {
    return (
      !!contestContactDetails && (isExpanded || contestSummary.length + (contestEvaluate?.length || 0) <= MAX_LENGTH)
    );
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
          contactDetailsContent={getContactDetails()}
          isExpanded={isExpanded}
          displayReadMore={shouldDisplayReadMore()}
          shouldDisplayEvaluate={shouldDisplayEvaluate()}
          shouldDisplayContactDetails={shouldDisplayContactDetails()}
          handleToggle={toggleExpand}
        />
      ) : (
        <ContestPromptPageLegacyLayout
          prompt={prompt}
          isExpanded={isExpanded}
          displayReadMore={shouldDisplayReadMore()}
          handleToggle={toggleExpand}
        />
      )}
    </>
  );
};

export default ContestPromptPage;
