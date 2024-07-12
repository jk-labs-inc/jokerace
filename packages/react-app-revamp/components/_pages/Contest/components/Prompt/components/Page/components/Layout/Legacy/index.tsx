import { Interweave, Node } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Image from "next/image";
import { FC, ReactNode } from "react";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";

interface ContestPromptPageLegacyLayoutProps {
  prompt: string;
  isExpanded: boolean;
  displayReadMore: boolean;
  handleToggle: () => void;
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

const ContestPromptPageLegacyLayout: FC<ContestPromptPageLegacyLayoutProps> = ({
  prompt,
  isExpanded,
  displayReadMore,
  handleToggle,
}) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const isVotingOpenOrClosed =
    contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
      </div>
      <div className="pl-5">
        <div className="border-l border-true-white">
          <div
            className="prose prose-invert pl-5 overflow-hidden"
            style={{ maxHeight: isVotingOpenOrClosed ? "none" : isExpanded ? "none" : "150px" }}
          >
            <Interweave content={prompt} matchers={[new UrlMatcher("url")]} transform={transform} />
          </div>
          {!isVotingOpenOrClosed && displayReadMore && (
            <div className="flex gap-1 items-center pl-5 mt-4 cursor-pointer" onClick={handleToggle}>
              <p className="text-[16px] text-positive-11 font-bold">{isExpanded ? "Read Less" : "Read More"}</p>
              <Image
                src="/contest/chevron.svg"
                width={24}
                height={24}
                alt="toggleRead"
                className={`transition-transform duration-300 ${isExpanded ? "transform rotate-180" : ""}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestPromptPageLegacyLayout;
