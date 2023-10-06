/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import MarkdownImage from "@components/UI/Markdown/components/MarkdownImage";
import MarkdownList from "@components/UI/Markdown/components/MarkdownList";
import MarkdownOrderedList from "@components/UI/Markdown/components/MarkdownOrderedList";
import MarkdownUnorderedList from "@components/UI/Markdown/components/MarkdownUnorderedList";
import { extractPathSegments } from "@helpers/extractPath";
import { isUrlTweet } from "@helpers/isUrlTweet";
import ordinalize from "@helpers/ordinalize";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { load } from "cheerio";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Children, FC, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import { useMediaQuery } from "react-responsive";
import { TwitterTweetEmbed } from "react-twitter-embed";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useAccount } from "wagmi";
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
  rank: number;
  isTied: boolean;
}

const MAX_LENGTH = 200;

const ProposalContent: FC<ProposalContentProps> = ({ id, proposal, votingOpen, rank, isTied }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { openConnectModal } = useConnectModal();
  let truncatedContent =
    proposal.content.length > MAX_LENGTH ? `${proposal.content.substring(0, MAX_LENGTH)}...` : proposal.content;
  const formattedVotingOpen = moment(votingOpen);
  const { isConnected } = useAccount();
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const { currentUserAvailableVotesAmount, isLoading } = useUserStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;

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
            {!isConnected ? (
              <p className="text-[16px] text-positive-11 font-bold" onClick={openConnectModal}>
                connect wallet to vote
              </p>
            ) : canVote ? (
              isLoading ? (
                <Skeleton
                  height={isMobile ? 32 : 40}
                  width={isMobile ? 100 : 160}
                  borderRadius={40}
                  baseColor="#706f78"
                  highlightColor="#FFE25B"
                  duration={1}
                />
              ) : (
                <ButtonV3
                  type={ButtonType.TX_ACTION}
                  colorClass="bg-gradient-next rounded-[40px]"
                  size={isMobile ? ButtonSize.FULL : ButtonSize.LARGE}
                  onClick={() => {
                    setPickProposal(id);
                    setIsVotingModalOpen(true);
                  }}
                >
                  add votes
                </ButtonV3>
              )
            ) : (
              <p className="text-[16px] text-neutral-10 font-bold">only allowlisted wallets can play</p>
            )}
          </>
        );
      case ContestStatus.VotingClosed:
        return <p className="text-neutral-10">voting closed</p>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contestStatus,
    proposal.votes,
    currentUserAvailableVotesAmount,
    setPickProposal,
    isConnected,
    isMobile,
    isLoading,
  ]);

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
      <div className="px-4 mt-4 flex items-center gap-1">
        <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />

        {rank > 0 && (
          <>
            <span className="text-neutral-9">&#8226;</span>{" "}
            <p className="text-[16px] font-bold text-neutral-9">
              {isMobile ? (
                <>
                  {rank}
                  <sup>{ordinalize(rank).suffix}</sup> place {isTied ? "(tied)" : ""}
                </>
              ) : (
                `${ordinalize(rank).label} place ${isTied ? "(tied)" : ""}`
              )}
            </p>
          </>
        )}
      </div>
      <Link
        href={`/contest/${chainName}/${contestAddress}/submission/${id}`}
        shallow
        scroll={false}
        className="flex items-center overflow-hidden px-14 h-3/4 md:h-3/4"
      >
        <>
          <ReactMarkdown
            className="markdown max-w-full text-[16px]"
            components={{
              div: ({ node, children, ...props }) => (
                <div {...props} className="flex gap-5 items-center markdown">
                  {children}
                </div>
              ),
              img: ({ node, ...props }) => <MarkdownImage imageSize="compact" src={props.src ?? ""} />,
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
          >
            {truncatedContent}
          </ReactMarkdown>
        </>
      </Link>
      <div className={`flex-shrink-0 ${canVote ? "px-7 md:px-14" : "px-14"}`}>
        <div className={`flex flex-col md:flex-row items-center ${canVote ? "" : "border-t border-primary-2"}`}>
          <div className="flex items-center py-4 justify-between w-full md:w-1/2 text-[16px] font-bold">
            {ProposalAction}
          </div>
        </div>
      </div>
      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </div>
  );
};

export default ProposalContent;
