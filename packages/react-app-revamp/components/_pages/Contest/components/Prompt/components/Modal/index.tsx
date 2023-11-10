import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { Interweave, Node } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC, ReactNode, useEffect, useState } from "react";

interface ContestPromptModalProps {
  prompt: string;
  hidePrompt?: boolean;
}

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "p") {
    return <p className="text-[16px]">{children}</p>;
  } else if (element === "ul") {
    return <ul className="list-disc list-inside list-explainer">{children}</ul>;
  } else if (element === "li") {
    return <li className="flex items-center">{children}</li>;
  }
};

const ContestPromptModal: FC<ContestPromptModalProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose } = useContestStore(state => state);
  const [isPromptOpen, setIsPromptOpen] = useState(moment().isBefore(votesClose) && !hidePrompt);
  const [contestType, contestTitle, contestPrompt] = prompt.split("|");

  useEffect(() => {
    setIsPromptOpen(!hidePrompt);
  }, [hidePrompt]);

  return (
    <>
      {isV3 ? (
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
                    <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} />
                  </div>
                </div>
              </Collapsible>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
            <button
              onClick={() => setIsPromptOpen(!isPromptOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
            >
              <ChevronUpIcon height={30} />
            </button>
          </div>

          <div className="pl-5">
            <Collapsible isOpen={isPromptOpen}>
              <div className="border-l border-true-white ">
                <div className="prose prose-invert pl-5 ">
                  <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} transform={transform} />
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestPromptModal;
