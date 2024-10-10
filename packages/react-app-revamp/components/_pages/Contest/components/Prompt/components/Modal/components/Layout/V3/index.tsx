import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC } from "react";

interface ContestPromptModalV3LayoutProps {
  contestName: string;
  contestType: string;
  contestSummary: string;
  isPromptOpen: boolean;
  contestEvaluate?: string;
  contestContactDetails?: string;
  setIsPromptOpen: (value: boolean) => void;
}

const ContestPromptModalV3Layout: FC<ContestPromptModalV3LayoutProps> = ({
  contestName,
  contestType,
  contestSummary,
  isPromptOpen,
  contestEvaluate,
  contestContactDetails,
  setIsPromptOpen,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 md:gap-4 items-center">
        <div className="relative inline-block">
          <span className="text-[24px] font-bold inline-block">
            <span className="relative z-10 bg-gradient-purple text-transparent bg-clip-text inline-block">
              {contestName}
            </span>
          </span>
        </div>
        <button
          onClick={() => setIsPromptOpen(!isPromptOpen)}
          className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      {isPromptOpen && (
        <div className="pl-5">
          <Collapsible isOpen={isPromptOpen}>
            <div className="border-l border-true-white ">
              <div className="prose prose-invert pl-5">
                <Interweave content={contestSummary} matchers={[new UrlMatcher("url")]} />
                {contestEvaluate ? (
                  <div>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={contestEvaluate} matchers={[new UrlMatcher("url")]} />
                  </div>
                ) : null}
                {contestContactDetails ? (
                  <div>
                    <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6"></div>
                    <Interweave content={contestContactDetails} matchers={[new UrlMatcher("url")]} />
                  </div>
                ) : null}
              </div>
            </div>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default ContestPromptModalV3Layout;
