/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
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
import { Children, FC, ReactNode, useState } from "react";
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

const MAX_LENGTH = 150;

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "div") {
    return <div className="flex gap-5 items-center markdown">{children}</div>;
  } else if (element === "img") {
    return <MarkdownImage imageSize="compact" src={node.getAttribute("src") ?? ""} />;
  } else if (element === "ul") {
    const truncatedChildren = Children.toArray(children).slice(0, 3);
    const combinedChildren =
      children.length > 3 ? [...truncatedChildren, <li key="ellipsis">...</li>] : truncatedChildren;

    return <MarkdownUnorderedList children={combinedChildren} />;
  } else if (element === "li") {
    return <MarkdownList children={children} />;
  } else if (element === "ol") {
    const truncatedChildren = Children.toArray(children).slice(0, 3);
    const finalChildren = children.length > 3 ? [...truncatedChildren, <li key="ellipsis">...</li>] : truncatedChildren;

    return <MarkdownOrderedList children={finalChildren} />;
  }
};

const ProposalContent: FC<ProposalContentProps> = ({ id, proposal, rank, isTied }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  let truncatedContent =
    proposal.content.length > MAX_LENGTH ? `${proposal.content.substring(0, MAX_LENGTH)}...` : proposal.content;
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;

  if (proposal.isContentImage) {
    const $ = load(proposal.content);
    const contentElements = $("*").not("script, style, img");
    let totalTextLength = 0;

    contentElements.each((_, element) => {
      const currentText = $(element).text();
      if (totalTextLength + currentText.length > MAX_LENGTH) {
        const remainingLength = MAX_LENGTH - totalTextLength;
        const truncatedText = currentText.substring(0, remainingLength) + "...";
        $(element).text(truncatedText);
        return false; // This stops the each loop
      }
      totalTextLength += currentText.length;
    });

    truncatedContent = `<div>${$.html()}</div>`;
  }

  return (
    <div className="flex flex-col w-full h-80 md:h-56 animate-appear rounded-[10px] border border-neutral-11 hover:bg-neutral-1 cursor-pointer transition-colors duration-500 ease-in-out">
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
        className="flex items-center overflow-hidden px-14 h-3/4 md:h-3/4"
      >
        <>
          <Interweave
            className="markdown max-w-full text-[16px] overflow-y-hidden md:overflow-auto"
            content={truncatedContent}
            transform={transform}
          />
        </>
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
