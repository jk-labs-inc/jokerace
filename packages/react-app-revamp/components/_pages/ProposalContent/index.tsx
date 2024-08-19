/* eslint-disable @next/next/no-img-element */
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { Tweet as TweetType } from "@helpers/isContentTweet";
import { loadFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "@helpers/localStorage";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { Interweave, Node } from "interweave";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Tweet } from "react-tweet";
import { useAccount } from "wagmi";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ImageWithFallback from "./components/ImageWithFallback";
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

interface ContestVisibilities {
  [contestId: string]: string[];
}

const HIDDEN_PROPOSALS_STORAGE_KEY = "hiddenProposalsPerContest";
const BROWSER_SESSION_CHECK_KEY = "browserSessionCheck";

interface ProposalContentProps {
  proposal: Proposal;
  allowDelete: boolean;
  selectedProposalIds: string[];
  toggleProposalSelection?: (proposalId: string) => void;
}

const transform = (node: HTMLElement, children: Node[]): ReactNode => {
  const element = node.tagName.toLowerCase();
  const src = node.getAttribute("src") ?? "";

  if (element === "img") {
    return <ImageWithFallback src={`${src}-medium`} fallbackSrc={src} alt={node.getAttribute("alt") ?? ""} />;
  }

  if (element === "a") {
    const content = node.textContent || "";
    const truncatedContent = content.length > 70 ? content.substring(0, 67) + "..." : content;

    return (
      <a href={node.getAttribute("href") ?? "#"} target="_blank" rel="noopener noreferrer">
        {truncatedContent}
      </a>
    );
  }
};

const clearStorageIfNeeded = () => {
  let session = sessionStorage.getItem(BROWSER_SESSION_CHECK_KEY);
  if (session == null) {
    removeFromLocalStorage(HIDDEN_PROPOSALS_STORAGE_KEY);
  }
  sessionStorage.setItem(BROWSER_SESSION_CHECK_KEY, "1");
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
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const [isContentHidden, setIsContentHidden] = useState(false);
  const formattedVotingOpen = moment(votesOpen);
  const commentLink = {
    pathname: `/contest/${chainName}/${contestAddress}/submission/${proposal.id}`,
    query: { comments: "comments" },
  };

  useEffect(() => {
    clearStorageIfNeeded();

    const visibilityState = loadFromLocalStorage<ContestVisibilities>(HIDDEN_PROPOSALS_STORAGE_KEY, {});
    const hiddenProposals = visibilityState[contestAddress] || [];

    setIsContentHidden(hiddenProposals.includes(proposal.id));
  }, [contestAddress, proposal.id]);

  const handleVotingModalOpen = () => {
    if (isContestCanceled) {
      alert("This contest has been canceled and voting is terminated.");
      return;
    }

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

  const toggleContentVisibility = () => {
    const newVisibility = !isContentHidden;
    setIsContentHidden(newVisibility);

    const visibilityState = loadFromLocalStorage<ContestVisibilities>(HIDDEN_PROPOSALS_STORAGE_KEY, {});
    let hiddenProposals = visibilityState[contestAddress] || [];

    if (newVisibility) {
      // addd proposal id to hidden list if not already there
      if (!hiddenProposals.includes(proposal.id)) {
        hiddenProposals = [...hiddenProposals, proposal.id];
      }
    } else {
      // remove proposal id from hidden list
      hiddenProposals = hiddenProposals.filter(id => id !== proposal.id);
    }

    if (hiddenProposals.length > 0) {
      visibilityState[contestAddress] = hiddenProposals;
    } else {
      // if there are no hidden proposals, remove the contest from the visibility state
      delete visibilityState[contestAddress];
    }

    saveToLocalStorage(HIDDEN_PROPOSALS_STORAGE_KEY, visibilityState);
  };

  const preprocessContent = (content: string) => {
    // Remove trailing newlines and spaces
    let processed = content.trim();
    // Remove consecutive newlines (replace with a single newline)
    processed = processed.replace(/\n\s*\n/g, "\n");
    // Remove empty paragraphs
    processed = processed.replace(/<p>\s*<\/p>/g, "");
    return processed;
  };

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-primary-2 animate-reveal">
      <ProposalContentInfo
        authorAddress={proposal.authorEthereumAddress}
        rank={proposal.rank}
        isTied={proposal.isTied}
        isMobile={isMobile}
        isContentHidden={isContentHidden}
        toggleContentVisibility={toggleContentVisibility}
      />

      {!isContentHidden ? (
        <div className="md:mx-8 flex flex-col gap-4">
          <div className="flex w-full">
            <div className="max-w-full">
              <Link
                className="inline-block p-4 rounded-[8px] bg-primary-1 border border-transparent hover:border-neutral-9 transition-colors duration-300 ease-in-out overflow-hidden"
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
                  <Interweave
                    className="prose prose-invert interweave-container"
                    content={proposal.content}
                    transform={transform}
                    tagName="div"
                  />
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
                <button
                  onClick={handleVotingModalOpen}
                  className="min-w-36 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-primary-1 rounded-[16px] cursor-pointer border border-transparent hover:border-positive-11 transition-colors duration-300 ease-in-out"
                >
                  <Image src="/contest/upvote-2.svg" width={23} height={23} alt="upvote" className="flex-shrink-0" />

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
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-neutral-9 flex-shrink-0" />
                <p className="text-[16px] text-neutral-9 font-bold flex-grow text-center">{proposal.commentsCount}</p>
              </Link>
            </div>
            {allowDelete && (
              <div className="h-8 w-8 relative cursor-pointer" onClick={() => toggleProposalSelection?.(proposal.id)}>
                <CheckIcon
                  className={`absolute top-0 left-0 transform transition-all ease-in-out duration-300 
        ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
        h-6 w-6 text-primary-10 bg-white bg-true-black border border-neutral-11 hover:text-primary-9 
        shadow-md hover:shadow-lg rounded-md`}
                />
                <TrashIcon
                  className={`absolute top-0 left-0 transition-opacity duration-300 
        ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
        h-6 w-6 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out`}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}

      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </div>
  );
};

export default ProposalContent;
