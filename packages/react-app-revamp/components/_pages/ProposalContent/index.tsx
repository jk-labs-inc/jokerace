import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { Tweet as TweetType } from "@helpers/isContentTweet";
import { ChatAltIcon, CheckIcon, TrashIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { load } from "cheerio";
import { Interweave, Node } from "interweave";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Tweet } from "react-tweet";
import { useAccount } from "wagmi";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ProposalContentInfo from "./components/ProposalContentInfo";

export interface Proposal {
  id: string;
  authorEthereumAddress: string;
  content: string;
  exists: boolean;
  isContentImage: boolean;
  tweet: TweetType;
  votes: number;
  rank: number;
  isTied: boolean;
  commentsCount: number;
}

interface ProposalContentProps {
  proposal: Proposal;
  allowDelete: boolean;
  selectedProposalIds: string[];
  toggleProposalSelection?: (proposalId: string) => void;
}

const MAX_CHARS = 400;

function smartTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Find the last space within the maxLength
  let lastSpace = text.lastIndexOf(" ", maxLength);

  // If no space found, look for punctuation marks
  if (lastSpace === -1) {
    const punctuationMarks = [".", "!", "?", ",", ";", ":", ")"];
    for (let mark of punctuationMarks) {
      let index = text.lastIndexOf(mark, maxLength);
      if (index > lastSpace) lastSpace = index;
    }
  }

  // If still no good breakpoint, use maxLength
  if (lastSpace === -1 || lastSpace < maxLength * 0.8) {
    lastSpace = maxLength;
  }

  // Trim any trailing spaces
  while (lastSpace > 0 && text[lastSpace - 1] === " ") {
    lastSpace--;
  }

  return text.substring(0, lastSpace) + "...";
}

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "img") {
    console.log("here?");
    return <MarkdownImage src={node.getAttribute("src") ?? ""} />;
  }
};

const ProposalContent: FC<ProposalContentProps> = ({
  proposal,
  allowDelete,
  selectedProposalIds,
  toggleProposalSelection,
}) => {
  const { isConnected } = useAccount();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const { votesOpen } = useContestStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;
  const isProposalTweet = proposal.tweet.isTweet;
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);

  const formattedVotingOpen = moment(votesOpen);
  const commentLink = {
    pathname: `/contest/${chainName}/${contestAddress}/submission/${proposal.id}`,
    query: { comments: "comments" },
  };

  let truncatedContent = "";

  if (proposal.isContentImage) {
    const cheerio = load(proposal.content);

    const firstImageSrc = cheerio("img").first().attr("src");

    const textContent = cheerio.text();
    const textLength = isMobile ? 100 : 200;

    const truncatedText = textContent.length > textLength ? textContent.substring(0, textLength) + "..." : textContent;

    truncatedContent = `<div><p>${truncatedText}</p><img src="${firstImageSrc}"/></div>`;
  } else {
    truncatedContent = smartTruncate(proposal.content, MAX_CHARS);
  }

  const handleVotingModalOpen = () => {
    if (contestStatus === ContestStatus.VotingClosed) {
      alert("Voting is closed for this contest.");
      return;
    }

    if (!isConnected) {
      alert("You need to be connected with a wallet to vote for a proposal.");
      return;
    }

    if (!canVote) {
      alert("You need to have votes to vote for a proposal.");
      return;
    }

    setPickProposal(proposal.id);
    setIsVotingModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-primary-2 animate-reveal">
      <ProposalContentInfo
        authorAddress={proposal.authorEthereumAddress}
        rank={proposal.rank}
        isTied={proposal.isTied}
        isMobile={isMobile}
      />
      <div className="md:mx-8 flex flex-col gap-4">
        <Link
          className="p-4 rounded-[8px] bg-primary-1 border border-transparent hover:border-neutral-9 transition-colors duration-300 ease-in-out overflow-hidden"
          href={`/contest/${chainName}/${contestAddress}/submission/${proposal.id}`}
          shallow
          scroll={false}
          prefetch
        >
          {isProposalTweet ? (
            <div className="dark not-prose">
              <Tweet apiUrl={`/api/tweet/${proposal.tweet.id}`} id={proposal.tweet.id} />
            </div>
          ) : (
            <Interweave className="prose prose-invert" content={proposal.content} transform={transform} />
          )}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
              <button
                onClick={handleVotingModalOpen}
                className="min-w-36 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-primary-1 rounded-[16px] cursor-pointer border border-transparent hover:border-positive-11 transition-colors duration-300 ease-in-out"
              >
                <Image src="/contest/upvote.svg" width={21.56} height={20.44} alt="upvote" className="flex-shrink-0" />
                <p className="text-[16px] text-positive-11 font-bold flex-grow text-center">
                  {formatNumberAbbreviated(proposal.votes)} vote{proposal.votes !== 1 ? "s" : ""}
                </p>
              </button>
            ) : (
              <p className="text-neutral-10 text-[16px] font-bold">
                voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}
              </p>
            )}

            <Link
              href={commentLink}
              className="min-w-16 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-primary-1 rounded-[16px] cursor-pointer border border-transparent hover:border-neutral-9 transition-colors duration-300 ease-in-out"
              shallow
              scroll={false}
            >
              <ChatAltIcon className="w-6 h-6 text-neutral-9 flex-shrink-0" />
              <p className="text-[16px] text-neutral-9 font-bold flex-grow text-center">{proposal.commentsCount}</p>
            </Link>
          </div>
          {allowDelete && (
            <div className="h-8 w-8 relative cursor-pointer" onClick={() => toggleProposalSelection?.(proposal.id)}>
              <CheckIcon
                className={`absolute top-0 left-0 transform transition-all ease-in-out duration-300 
        ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
        h-8 w-8 text-primary-10 bg-white bg-true-black border border-neutral-11 hover:text-primary-9 
        shadow-md hover:shadow-lg rounded-md`}
              />
              <TrashIcon
                className={`absolute top-0 left-0 transition-opacity duration-300 
        ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
        h-8 w-8 text-negative-11 bg-true-black hover:text-negative-10`}
              />
            </div>
          )}
        </div>
      </div>

      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </div>
  );
};

export default ProposalContent;
