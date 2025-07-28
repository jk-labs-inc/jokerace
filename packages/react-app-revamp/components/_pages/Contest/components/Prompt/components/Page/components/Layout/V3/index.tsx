import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState, useEffect } from "react";
import EditContestPrompt from "./components/EditContestPrompt";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";
import { useDescriptionExpansionStore } from "./store";

interface ContestPromptPageV3LayoutProps {
  prompt: string;
  canEditTitleAndDescription: boolean;
}

const ContestPromptPageV3Layout: FC<ContestPromptPageV3LayoutProps> = ({ prompt, canEditTitleAndDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestState } = useContestStateStore(state => state);
  const { triggerRecalculation } = useDescriptionExpansionStore();
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const { contestSummary, contestEvaluate, contestContactDetails } = parsePrompt(prompt);
  const fullText = [contestSummary, contestEvaluate, contestContactDetails].filter(Boolean).join("\n\n");
  const characterLimit = 250;
  const shouldShowReadMore = fullText.length > characterLimit;
  const displayText = !isExpanded && shouldShowReadMore ? fullText.slice(0, characterLimit) + "..." : fullText;

  const renderSection = (content: string, showDivider: boolean) => {
    if (!content) return null;

    return (
      <>
        {showDivider && <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6" />}
        <Interweave content={content} matchers={[new UrlMatcher("url")]} />
      </>
    );
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Trigger masonry recalculation after a short delay to allow for DOM update
    setTimeout(() => {
      triggerRecalculation();
    }, 100);
  };

  return (
    <div className="flex items-start relative w-full">
      <div className="absolute md:top-2 right-0 md:right-auto md:left-0 md:-translate-x-full md:-ml-4">
        <EditContestPrompt canEditPrompt={canEditTitleAndDescription} prompt={prompt} />
      </div>

      <div className="flex flex-col gap-2 w-80 xs:w-[460px] sm:w-[560px]">
        <div className="relative">
          <div
            className={`
              prose prose-invert flex flex-col 
              ${isContestCanceled ? "line-through" : ""}
            `}
          >
            {isExpanded ? (
              <>
                {renderSection(contestSummary, false)}
                {renderSection(contestEvaluate, true)}
                {renderSection(contestContactDetails, true)}
              </>
            ) : (
              <Interweave content={displayText} matchers={[new UrlMatcher("url")]} />
            )}
          </div>
        </div>

        {shouldShowReadMore && (
          <div className="w-full flex items-center justify-start">
            <button
              onClick={handleToggleExpanded}
              className="text-[12px] md:text-[16px] font-bold flex items-center justify-center gap-1 text-positive-11  hover:text-positive-10 transition-all duration-300 ease-in-out"
            >
              {isExpanded ? "show less" : "show more"}
              {isExpanded ? (
                <ChevronUpIcon
                  width={isMobile ? 16 : 21}
                  height={isMobile ? 16 : 21}
                  className="transition-transform duration-300"
                />
              ) : (
                <ChevronDownIcon
                  width={isMobile ? 16 : 21}
                  height={isMobile ? 16 : 21}
                  className="md:mt-1 transition-transform duration-300"
                />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestPromptPageV3Layout;
