import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC } from "react";

interface ContestPromptModalV3LayoutProps {
  contestTitle: string;
  contestType: string;
  contestSummary: string;
  isPromptOpen: boolean;
  contestEvaluate?: string;
  setIsPromptOpen: (value: boolean) => void;
}

const ContestPromptModalV3Layout: FC<ContestPromptModalV3LayoutProps> = ({
  contestTitle,
  contestType,
  contestSummary,
  isPromptOpen,
  contestEvaluate,
  setIsPromptOpen,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 md:gap-4 items-center">
        <p className="text-[24px] text-neutral-11 font-bold">{contestTitle}</p>
        <div className="hidden md:flex items-center px-4 leading-tight py-[1px] bg-neutral-10 rounded-[5px] text-true-black text-[16px] font-bold">
          {contestType}
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
              </div>
            </div>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default ContestPromptModalV3Layout;
