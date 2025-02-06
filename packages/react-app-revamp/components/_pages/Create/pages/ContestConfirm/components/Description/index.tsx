import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Prompt } from "@hooks/useDeployContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";
import { useLineCount } from "@hooks/useLineCount";
import ContestImage from "@components/_pages/Contest/components/ContestImage";
interface CreateContestConfirmDescriptionProps {
  prompt: Prompt;
  step: Steps;
  imageUrl?: string;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmDescription: FC<CreateContestConfirmDescriptionProps> = ({
  prompt,
  step,
  imageUrl,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { elementRef, lineCount } = useLineCount();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const shouldShowReadMore = lineCount > 5;

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div className="flex flex-col gap-2">
        <div className="text-[12px] uppercase font-bold text-neutral-9">Description</div>
        <div className="flex flex-col gap-4">
          {imageUrl ? <ContestImage imageUrl={imageUrl} /> : null}
          <div className="relative">
            <div ref={elementRef} className="prose prose-invert flex flex-col invisible absolute w-full">
              <Interweave content={prompt.summarize} matchers={[new UrlMatcher("url")]} />
              {prompt.evaluateVoters && (
                <>
                  <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                  <Interweave content={prompt.evaluateVoters} matchers={[new UrlMatcher("url")]} />
                </>
              )}
              {prompt.contactDetails && (
                <>
                  <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                  <Interweave content={prompt.contactDetails} matchers={[new UrlMatcher("url")]} />
                </>
              )}
            </div>

            <div
              className={`prose prose-invert flex flex-col text-neutral-11 transition-color duration-300 ${!isExpanded && shouldShowReadMore ? "overflow-hidden" : ""}`}
              style={{
                ...(!isExpanded && shouldShowReadMore
                  ? {
                      maskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                      maxHeight: `${Math.min(lineCount, 5) * 1.6}em`,
                    }
                  : {}),
              }}
            >
              <Interweave content={prompt.summarize} matchers={[new UrlMatcher("url")]} />
              {(isExpanded || !shouldShowReadMore) && (
                <>
                  {prompt.evaluateVoters && (
                    <>
                      <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                      <Interweave content={prompt.evaluateVoters} matchers={[new UrlMatcher("url")]} />
                    </>
                  )}
                  {prompt.contactDetails && (
                    <>
                      <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                      <Interweave content={prompt.contactDetails} matchers={[new UrlMatcher("url")]} />
                    </>
                  )}
                </>
              )}
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
