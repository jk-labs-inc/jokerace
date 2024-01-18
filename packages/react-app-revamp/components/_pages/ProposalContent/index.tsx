import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import { extractPathSegments } from "@helpers/extractPath";
import { useUserStore } from "@hooks/useUser/store";
import { load } from "cheerio";
import { Interweave, Node } from "interweave";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ProposalContentAction from "./components/ProposalContentAction";
import ProposalContentInfo from "./components/ProposalContentInfo";

export interface Proposal {
  id: string;
  authorEthereumAddress: string;
  content: string;
  exists: boolean;
  isContentImage: boolean;
  votes: number;
  rank: number;
  isTied: boolean;
  commentsCount: number;
}

interface ProposalContentProps {
  proposal: Proposal;
}

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "div") {
    return <div className="flex gap-5 flex-col md:flex-row items-start md:items-center markdown">{children}</div>;
  } else if (element === "img") {
    return <MarkdownImage imageSize="compact" src={node.getAttribute("src") ?? ""} />;
  }
};

const ProposalContent: FC<ProposalContentProps> = ({ proposal }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;

  let truncatedContent = "";
  if (proposal.isContentImage) {
    const cheerio = load(proposal.content);

    const firstImageSrc = cheerio("img").first().attr("src");

    const textContent = cheerio.text();
    const textLength = isMobile ? 100 : 200;

    const truncatedText = textContent.length > textLength ? textContent.substring(0, textLength) + "..." : textContent;

    truncatedContent = `<div><p>${truncatedText}</p><img src="${firstImageSrc}"/></div>`;
  } else {
    truncatedContent = proposal.content;
  }

  return (
    <div className="flex flex-col w-full h-96 md:h-80 animate-appear rounded-[10px] border border-neutral-11 hover:bg-neutral-1 cursor-pointer transition-colors duration-500 ease-in-out">
      <Link href={`/contest/${chainName}/${contestAddress}/submission/${proposal.id}`} shallow scroll={false}>
        <ProposalContentInfo
          authorAddress={proposal.authorEthereumAddress}
          rank={proposal.rank}
          isTied={proposal.isTied}
          isMobile={isMobile}
          commentsCount={proposal.commentsCount}
        />
        <div className="flex items-center overflow-hidden px-14 h-64 md:h-52">
          <Interweave
            className="line-clamp-6 md:line-clamp-5 markdown overflow-y-hidden text-[16px] md:text-[18px]"
            content={truncatedContent}
            transform={transform}
          />
        </div>
      </Link>
      <div className={`flex-shrink-0 ${canVote ? "px-7 md:px-14" : "px-14"}`}>
        <div className={`flex flex-col md:flex-row items-center ${canVote ? "" : "border-t border-primary-2"}`}>
          <div className="flex items-center py-4 justify-between w-full md:w-1/2 text-[16px] font-bold">
            <ProposalContentAction proposalId={proposal.id} onVotingModalOpen={value => setIsVotingModalOpen(value)} />
          </div>
        </div>
      </div>
      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </div>
  );
};

export default ProposalContent;
