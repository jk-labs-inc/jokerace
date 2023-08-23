/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import ButtonV3 from "@components/UI/ButtonV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import MarkdownList from "@components/UI/Markdown/components/MarkdownList";
import MarkdownOrderedList from "@components/UI/Markdown/components/MarkdownOrderedList";
import MarkdownText from "@components/UI/Markdown/components/MarkdownText";
import MarkdownUnorderedList from "@components/UI/Markdown/components/MarkdownUnorderedList";
import { formatNumber } from "@helpers/formatNumber";
import { isUrlTweet } from "@helpers/isUrlTweet";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { load } from "cheerio";
import moment from "moment";
import React, { Children } from "react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TwitterTweetEmbed } from "react-twitter-embed";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useAccount } from "wagmi";
import DialogModalProposal from "../DialogModalProposal";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";

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
  votingOpen: Date;
  prompt: string;
}

const MAX_LENGTH = 200;
let MAX_LENGTH_PARAGRAPH = 200;

const ProposalContent: FC<ProposalContentProps> = ({ id, proposal, votingOpen, prompt }) => {
  let truncatedContent =
    proposal.content.length > MAX_LENGTH ? `${proposal.content.substring(0, MAX_LENGTH)}...` : proposal.content;
  const formattedVotingOpen = moment(votingOpen);
  const { isConnected } = useAccount();
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const currentUserAvailableVotesAmount = useUserStore(state => state.currentUserAvailableVotesAmount);
  const previousVotesRef = useRef(proposal.votes);
  const [isVoteChanged, setIsVoteChanged] = useState(false);
  const showVoteButton = !isConnected || currentUserAvailableVotesAmount > 0;
  const voteButtonMessage = isConnected ? "vote" : "connect wallet to vote";

  useEffect(() => {
    let timer: any;
    if (previousVotesRef.current !== proposal.votes) {
      setIsVoteChanged(true);
      timer = setTimeout(() => setIsVoteChanged(false), 1000);
      previousVotesRef.current = proposal.votes;
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [proposal.votes]);

  const ProposalAction = useMemo<React.ReactNode>(() => {
    switch (contestStatus) {
      case ContestStatus.ContestOpen:
      case ContestStatus.SubmissionOpen:
        return (
          <>
            <p className="text-neutral-10">voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}</p>
          </>
        );
      case ContestStatus.VotingOpen:
        return (
          <>
            <p className={`text-positive-11 ${isVoteChanged ? "animate-flicker" : ""}`}>
              {formatNumber(proposal.votes)} votes
            </p>
            {showVoteButton && (
              <ButtonV3
                type="txAction"
                color="bg-gradient-vote rounded-[40px]"
                size="large"
                onClick={() => {
                  setPickProposal(id);
                  setIsVotingModalOpen(true);
                }}
              >
                {voteButtonMessage}
              </ButtonV3>
            )}
          </>
        );
      case ContestStatus.VotingClosed:
        return (
          <>
            <p className="text-positive-11">{formatNumber(proposal.votes)} votes</p>
            <p className="text-neutral-10">voting closed</p>
          </>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestStatus, proposal.votes, currentUserAvailableVotesAmount, setPickProposal, isConnected]);

  if (isUrlTweet(truncatedContent)) {
    const tweetId = new URL(truncatedContent).pathname.split("/")[3];
    return (
      <>
        <a target="_blank" rel="nofollow noreferrer" className="link mb-1 text-2xs" href={truncatedContent}>
          View on Twitter
        </a>
        <TwitterTweetEmbed tweetId={tweetId} options={{ theme: "dark", dnt: "true" }} />
      </>
    );
  }

  if (proposal.isContentImage) {
    const $ = load(proposal.content);
    const contentElements = $("*").not("script, style, img");
    let totalTextLength = 0;

    contentElements.each((_, element) => {
      const currentText = $(element).text();
      if (totalTextLength + currentText.length > MAX_LENGTH_PARAGRAPH) {
        const remainingLength = MAX_LENGTH_PARAGRAPH - totalTextLength;
        const truncatedText = currentText.substring(0, remainingLength) + "...";
        $(element).text(truncatedText);
        return false; // This stops the each loop
      }
      totalTextLength += currentText.length;
    });

    truncatedContent = `<div>${$.html()}</div>`;
  }

  return (
    <div className="flex flex-col w-full h-96 md:h-56 animate-appear rounded-[10px] border border-neutral-11 hover:bg-neutral-1 cursor-pointer transition-colors duration-500 ease-in-out">
      <div
        className="flex items-center overflow-hidden  px-8 py-2 h-3/5 md:h-3/4"
        onClick={() => setIsProposalModalOpen(true)}
      >
        <ReactMarkdown
          className="markdown max-w-full"
          components={{
            div: ({ node, children, ...props }) => (
              <div {...props} className="flex gap-5 items-center markdown">
                {children}
              </div>
            ),
            img: ({ node, ...props }) => <MarkdownImage imageSize="compact" src={props.src ?? ""} />,
            p: ({ node, children, ...props }) => <MarkdownText children={children} props={props} />,
            ul: ({ node, children, ...props }) => {
              const truncatedChildren = Children.toArray(children).slice(0, 3);
              const combinedChildren =
                children.length > 3 ? [...truncatedChildren, <li key="ellipsis">...</li>] : truncatedChildren;

              return <MarkdownUnorderedList children={combinedChildren} props={props} />;
            },
            li: ({ node, children, ...props }) => <MarkdownList children={children} props={props} />,
            ol: ({ node, children, ...props }) => {
              const truncatedChildren = Children.toArray(children).slice(0, 3);
              const finalChildren =
                children.length > 3 ? [...truncatedChildren, <li key="ellipsis">...</li>] : truncatedChildren;

              return <MarkdownOrderedList children={finalChildren} props={props} />;
            },
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize, remarkGfm]}
          children={truncatedContent}
        />
      </div>

      <div className="border-t border-neutral-10 h-2/5 md:h-1/4 flex flex-col md:flex-row items-center">
        <div className="flex pl-8 w-full md:w-1/2 h-full border-b md:border-r border-neutral-10">
          <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
        </div>
        <div className="flex items-center justify-between pl-8 md:pl-4 pr-4 w-full md:w-1/2 h-full text-[16px] font-bold">
          {ProposalAction}
        </div>
      </div>

      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
      <DialogModalProposal
        proposalId={id}
        prompt={prompt}
        isOpen={isProposalModalOpen}
        setIsOpen={setIsProposalModalOpen}
        proposal={proposal}
      />
    </div>
  );
};

export default ProposalContent;
