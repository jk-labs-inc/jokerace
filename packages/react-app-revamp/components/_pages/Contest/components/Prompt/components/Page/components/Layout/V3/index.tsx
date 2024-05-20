import { ChevronUpIcon } from "@heroicons/react/outline";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ContestPromptPageV3LayoutProps {
  contestTitle: string;
  contestType: string;
  summaryContent: string;
  evaluateContent: string;
  contactDetailsContent: string;
  isExpanded: boolean;
  displayReadMore: boolean;
  shouldDisplayEvaluate: boolean;
  shouldDisplayContactDetails: boolean;
  handleToggle: () => void;
}

const ContestPromptPageV3Layout: FC<ContestPromptPageV3LayoutProps> = ({
  contestTitle,
  contestType,
  summaryContent,
  evaluateContent,
  contactDetailsContent,
  isExpanded,
  displayReadMore,
  shouldDisplayEvaluate,
  shouldDisplayContactDetails,
  handleToggle,
}) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const { contestStatus } = useContestStatusStore(state => state);

  useEffect(() => {
    if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) {
      setIsDescriptionOpen(false);
    }
  }, [contestStatus]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <p className="text-[20px] md:text-[24px] text-neutral-11 font-bold">{contestTitle}</p>
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
            <div className="overflow-hidden" style={{ maxHeight: "999em" }}>
              <div className="prose prose-invert pl-5 flex flex-col">
                <Interweave content={summaryContent} matchers={[new UrlMatcher("url")]} />
                {shouldDisplayEvaluate ? (
                  <>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={evaluateContent} matchers={[new UrlMatcher("url")]} />
                  </>
                ) : null}
                {shouldDisplayContactDetails ? (
                  <>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={contactDetailsContent} matchers={[new UrlMatcher("url")]} />
                  </>
                ) : null}
              </div>
            </div>
            {displayReadMore && (
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
