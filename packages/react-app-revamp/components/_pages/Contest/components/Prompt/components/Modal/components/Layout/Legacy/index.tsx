import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { Interweave, Node } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, ReactNode } from "react";

interface ContestPromptModalLegacyLayoutProps {
  prompt: string;
  isPromptOpen: boolean;
  setIsPromptOpen: (value: boolean) => void;
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

const ContestPromptModalLegacyLayout: FC<ContestPromptModalLegacyLayoutProps> = ({
  prompt,
  isPromptOpen,
  setIsPromptOpen,
}) => {
  return (
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
              <Interweave content={prompt} matchers={[new UrlMatcher("url")]} transform={transform} />
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

export default ContestPromptModalLegacyLayout;
