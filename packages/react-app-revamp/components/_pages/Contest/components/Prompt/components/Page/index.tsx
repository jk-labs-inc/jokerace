import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { FC, useState } from "react";
import ContestPromptPageLegacyLayout from "./components/Layout/Legacy";
import ContestPromptPageV3Layout from "./components/Layout/V3";

interface ContestPromptPageProps {
  prompt: string;
}

const MAX_LENGTH = 200;

const ContestPromptPage: FC<ContestPromptPageProps> = ({ prompt }) => {
  const { isV3 } = useContestStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contestType, contestTitle, contestSummary, contestEvaluate, contestContactDetails] = prompt.split("|");

  const isVotingOpenOrClosed =
    contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;

  const shouldDisplayReadMore = () => {
    if (isVotingOpenOrClosed) return false;

    const totalLength = contestSummary.length + (contestEvaluate?.length || 0) + (contestContactDetails?.length || 0);
    return totalLength > MAX_LENGTH;
  };

  const getContent = () => {
    if (isVotingOpenOrClosed || isExpanded) {
      return {
        summaryContent: contestSummary,
        evaluateContent: contestEvaluate || "",
        contactDetailsContent: contestContactDetails || "",
      };
    }

    let remainingLength = MAX_LENGTH;
    let summaryContent = contestSummary.slice(0, remainingLength);
    remainingLength -= summaryContent.length;

    let evaluateContent = "";
    if (remainingLength > 0 && contestEvaluate) {
      evaluateContent = contestEvaluate.slice(0, remainingLength);
      remainingLength -= evaluateContent.length;
    }

    let contactDetailsContent = "";
    if (remainingLength > 0 && contestContactDetails) {
      contactDetailsContent = contestContactDetails.slice(0, remainingLength);
    }

    return { summaryContent, evaluateContent, contactDetailsContent };
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const { summaryContent, evaluateContent, contactDetailsContent } = getContent();

  return (
    <>
      {isV3 ? (
        <ContestPromptPageV3Layout
          contestTitle={contestTitle}
          contestType={contestType}
          summaryContent={summaryContent}
          evaluateContent={evaluateContent}
          contactDetailsContent={contactDetailsContent}
          isExpanded={isExpanded}
          displayReadMore={shouldDisplayReadMore()}
          shouldDisplayEvaluate={!!evaluateContent}
          shouldDisplayContactDetails={!!contactDetailsContent}
          handleToggle={toggleExpand}
        />
      ) : (
        <ContestPromptPageLegacyLayout
          prompt={isVotingOpenOrClosed || isExpanded ? prompt : summaryContent}
          isExpanded={isExpanded}
          displayReadMore={shouldDisplayReadMore()}
          handleToggle={toggleExpand}
        />
      )}
    </>
  );
};

export default ContestPromptPage;
