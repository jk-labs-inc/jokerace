/* eslint-disable react/no-children-prop */
import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import MarkdownList from "@components/UI/Markdown/components/MarkdownList";
import MarkdownOrderedList from "@components/UI/Markdown/components/MarkdownOrderedList";
import MarkdownUnorderedList from "@components/UI/Markdown/components/MarkdownUnorderedList";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useUserStore } from "@hooks/useUser/store";
import { load } from "cheerio";
import { Interweave, Node } from "interweave";
import Link from "next/link";
import { useRouter } from "next/router";
import { Children, FC, ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ProposalContentAction from "./components/ProposalContentAction";
import ProposalContentInfo from "./components/ProposalContentInfo";

export interface Proposal {
  authorEthereumAddress: string;
  content: string;
  exists: boolean;
  isContentImage: boolean;
  votes: number;
}

interface ProposalContentProps {
  id: string;
  proposal: Proposal;
  rank: number;
  isTied: boolean;
}

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "div") {
    return <div className="flex gap-5 items-center markdown">{children}</div>;
  } else if (element === "img") {
    return <MarkdownImage imageSize="compact" src={node.getAttribute("src") ?? ""} />;
  }
};

const ProposalContent: FC<ProposalContentProps> = ({ id, proposal, rank, isTied }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;

  let truncatedContent = "";
  if (proposal.isContentImage) {
    const cheerio = load(proposal.content);
    const textContent = cheerio.text();

    if (textContent.length > 100) {
      truncatedContent = textContent.substring(0, 100) + `...`;
    } else {
      truncatedContent = `<div>${proposal.content}</div>`;
    }
  } else {
    truncatedContent = proposal.content;
  }

  return (
    <div className="flex flex-col w-full h-80 md:h-56 animate-appear rounded-[10px] border border-neutral-11 hover:bg-neutral-1 shadow-proposal-card cursor-pointer transition-colors duration-500 ease-in-out">
      <ProposalContentInfo
        authorAddress={proposal.authorEthereumAddress}
        rank={rank}
        isTied={isTied}
        isMobile={isMobile}
      />
      <Link
        href={`/contest/${chainName}/${contestAddress}/submission/${id}`}
        shallow
        scroll={false}
        className="flex items-center overflow-hidden px-14 h-3/4"
      >
        <Interweave className="line-clamp-3 markdown text-[18px] " content={truncatedContent} transform={transform} />
      </Link>
      <div className={`flex-shrink-0 ${canVote ? "px-7 md:px-14" : "px-14"}`}>
        <div className={`flex flex-col md:flex-row items-center ${canVote ? "" : "border-t border-primary-2"}`}>
          <div className="flex items-center py-4 justify-between w-full md:w-1/2 text-[16px] font-bold">
            <ProposalContentAction proposalId={id} onVotingModalOpen={value => setIsVotingModalOpen(value)} />
          </div>
        </div>
      </div>
      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </div>
  );
};

export default ProposalContent;
