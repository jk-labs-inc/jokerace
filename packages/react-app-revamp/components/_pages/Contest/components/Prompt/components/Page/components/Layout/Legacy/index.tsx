import { Interweave, Node } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, ReactNode } from "react";

interface ContestPromptPageLegacyLayoutProps {
  prompt: string;
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

const ContestPromptPageLegacyLayout: FC<ContestPromptPageLegacyLayoutProps> = ({ prompt }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
      </div>
      <div className="pl-5">
        <div className="border-l border-true-white">
          <div className="prose prose-invert pl-5 overflow-hidden">
            <Interweave content={prompt} matchers={[new UrlMatcher("url")]} transform={transform} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestPromptPageLegacyLayout;
