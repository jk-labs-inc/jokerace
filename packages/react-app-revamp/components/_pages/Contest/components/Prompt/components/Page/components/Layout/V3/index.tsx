import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ContestPromptPageV3LayoutProps {
  prompt: string;
}

const MAX_LENGTH = 200;

const ContestPromptPageV3Layout: FC<ContestPromptPageV3LayoutProps> = ({ prompt }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { contestStatus } = useContestStatusStore(state => state);
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const [contestType, contestTitle, contestSummary, contestEvaluate, contestContactDetails] = prompt.split("|");
  const isVotingOpenOrClosed =
    contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;
  const { isLoading } = useContestStore(state => state);

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

  useEffect(() => {
    if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) {
      setIsDescriptionOpen(false);
    }
  }, [contestStatus, isLoading]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <p
          className={`text-[20px] md:text-[24px] text-neutral-11 font-bold ${isContestCanceled ? "line-through" : ""}`}
        >
          {contestTitle}
        </p>
        <div className="hidden md:flex items-center px-4 leading-tight py-[1px] bg-neutral-10 rounded-[5px] text-true-black text-[16px] font-bold">
          {contestType}
        </div>
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className={`transition-transform duration-500 ease-in-out transform ${isDescriptionOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      {isDescriptionOpen ? (
        <div className="pl-5">
          <div className="border-l border-true-white">
            <div
              className={`overflow-hidden ${isContestCanceled ? "line-through" : ""}`}
              style={{ maxHeight: isVotingOpenOrClosed ? "none" : isExpanded ? "none" : "150px" }}
            >
              <div className="prose prose-invert pl-5 flex flex-col">
                <Interweave content={summaryContent} matchers={[new UrlMatcher("url")]} />
                {shouldDisplayEvaluate && (
                  <>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={evaluateContent} matchers={[new UrlMatcher("url")]} />
                  </>
                )}
                {shouldDisplayContactDetails && (
                  <>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={contactDetailsContent} matchers={[new UrlMatcher("url")]} />
                  </>
                )}
              </div>
            </div>
            {!isVotingOpenOrClosed && shouldDisplayReadMore() && (
              <div className="flex gap-1 items-center pl-5 mt-4 cursor-pointer" onClick={handleToggle}>
                <p className="text-[16px] text-positive-11 font-bold">{isExpanded ? "Read Less" : "Read More"}</p>
                <Image
                  src="/contest/chevron.svg"
                  width={24}
                  height={24}
                  alt="toggleRead"
                  className={`transition-transform duration-300 ${isExpanded ? "transform rotate-180 pt-0" : "pt-1"}`}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ContestPromptPageV3Layout;
