import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState } from "react";
import EditContestPrompt from "./components/EditContestPrompt";

interface ContestPromptPageV3LayoutProps {
  prompt: string;
  canEditTitleAndDescription: boolean;
}

const MAX_LENGTH = 200;

const ContestPromptPageV3Layout: FC<ContestPromptPageV3LayoutProps> = ({ prompt, canEditTitleAndDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const { contestSummary, contestEvaluate, contestContactDetails } = parsePrompt(prompt);

  const shouldDisplayReadMore = () => {
    const totalLength = contestSummary.length + (contestEvaluate?.length || 0) + (contestContactDetails?.length || 0);
    return totalLength > MAX_LENGTH;
  };

  const getContent = () => {
    if (isExpanded) {
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

    const isContentTruncated =
      contestSummary.length + (contestEvaluate?.length || 0) + (contactDetailsContent?.length || 0) > MAX_LENGTH;

    if (isContentTruncated) {
      if (contactDetailsContent) {
        contactDetailsContent = contactDetailsContent.trim() + "...";
      } else if (evaluateContent) {
        evaluateContent = evaluateContent.trim() + "...";
      } else {
        summaryContent = summaryContent.trim() + "...";
      }
    }

    return { summaryContent, evaluateContent, contactDetailsContent };
  };

  const { summaryContent, evaluateContent, contactDetailsContent } = getContent();

  const shouldDisplayEvaluate = !!evaluateContent;
  const shouldDisplayContactDetails = !!contactDetailsContent;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex items-start w-full">
      <div className="flex flex-col gap-2 md:gap-4 w-80 xs:w-[460px] sm:w-[560px]">
        <div
          className={`overflow-hidden ${isContestCanceled ? "line-through" : ""}`}
          style={{ maxHeight: isExpanded ? "none" : "150px" }}
        >
          <div className="prose prose-invert flex flex-col">
            <Interweave content={summaryContent} matchers={[new UrlMatcher("url")]} />
            {shouldDisplayEvaluate && (
              <>
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                <Interweave content={evaluateContent} matchers={[new UrlMatcher("url")]} />
              </>
            )}
            {shouldDisplayContactDetails && (
              <div>
                <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                <Interweave content={contactDetailsContent} matchers={[new UrlMatcher("url")]} />
              </div>
            )}
          </div>
        </div>
        {shouldDisplayReadMore() && (
          <div className="flex gap-1 items-center cursor-pointer" onClick={handleToggle}>
            <p className="text-[16px] text-positive-11">{isExpanded ? "less description" : "full description"}</p>
            <img
              src="/contest/chevron.svg"
              width={24}
              height={24}
              alt="toggleRead"
              className={`transition-transform duration-300 ${isExpanded ? "transform rotate-180 pt-0" : "pt-1"}`}
            />
          </div>
        )}
      </div>
      <div className="ml-auto">
        <EditContestPrompt canEditPrompt={canEditTitleAndDescription} prompt={prompt} />
      </div>
    </div>
  );
};

export default ContestPromptPageV3Layout;
