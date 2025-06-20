import ContestImage from "@components/_pages/Contest/components/ContestImage";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLineCount } from "@hooks/useLineCount";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateContestConfirmLayout from "../Layout";
import { calculateContentBreakpoint } from "@helpers/textUtils";
import { Prompt } from "@hooks/useDeployContest/slices/contestInfoSlice";

interface CreateContestConfirmDescriptionProps {
  prompt: Prompt;
  step: number;
  imageUrl?: string;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmDescription: FC<CreateContestConfirmDescriptionProps> = ({
  prompt,
  step,
  imageUrl,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { elementRef, lineCount } = useLineCount();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const maxVisibleLines = 6;
  const shouldShowReadMore = lineCount > maxVisibleLines;

  const breakpoint = calculateContentBreakpoint({
    elementRef,
    shouldShowReadMore,
    isExpanded,
    maxVisibleLines,
    sections: [
      { id: "summarize", content: prompt.summarize },
      { id: "evaluateVoters", content: prompt.evaluateVoters },
      { id: "contactDetails", content: prompt.contactDetails },
    ],
  });

  const renderSection = (content: string, showDivider: boolean) => {
    if (!content) return null;

    return (
      <>
        {showDivider && <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6" />}
        <Interweave content={content} matchers={[new UrlMatcher("url")]} />
      </>
    );
  };

  const shouldShowEvaluate = isExpanded || !shouldShowReadMore || (breakpoint && breakpoint.section !== "summarize");

  const shouldShowContactDetails =
    isExpanded || !shouldShowReadMore || (breakpoint && breakpoint.section === "contactDetails");

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2 w-80 xs:w-[460px] sm:w-[560px]">
        <div className="text-[12px] uppercase font-bold text-neutral-9">Description</div>
        <div className="flex flex-col gap-4">
          {imageUrl ? <ContestImage imageUrl={imageUrl} /> : null}
          <div
            className="relative"
            style={{
              overflow: "hidden",
              height: !isExpanded && shouldShowReadMore ? `${Math.min(lineCount, maxVisibleLines) * 1.6}em` : "auto",
            }}
          >
            <div ref={elementRef} className="prose prose-invert flex flex-col invisible absolute w-full">
              {renderSection(prompt.summarize, false)}
              {renderSection(prompt.evaluateVoters, true)}
              {renderSection(prompt.contactDetails || "", true)}
            </div>

            <div
              className={`prose prose-invert flex flex-col text-neutral-11 transition-color duration-300`}
              style={{
                ...(!isExpanded && shouldShowReadMore
                  ? {
                      maskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                      maxHeight: `${Math.min(lineCount, maxVisibleLines) * 1.6}em`,
                      height: `${Math.min(lineCount, maxVisibleLines) * 1.6}em`,
                    }
                  : {}),
              }}
            >
              {renderSection(prompt.summarize, false)}
              {shouldShowEvaluate && renderSection(prompt.evaluateVoters, true)}
              {shouldShowContactDetails && renderSection(prompt.contactDetails || "", true)}
            </div>
          </div>
        </div>

        {shouldShowReadMore && !isExpanded && (
          <div className="w-full flex -mt-12 items-center justify-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[12px] md:text-[16px] font-bold flex z-50 w-[120px] md:w-40 h-10 rounded-lg items-center justify-center bg-primary-1 gap-1 text-positive-11 hover:bg-positive-11 hover:text-primary-1 transition-all duration-300 ease-in-out"
            >
              <span>full description</span>
              <ChevronDownIcon
                width={isMobile ? 16 : 21}
                height={isMobile ? 16 : 21}
                className="md:mt-1 transition-transform duration-300"
              />
            </button>
          </div>
        )}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmDescription;
