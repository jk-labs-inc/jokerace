import { Proposal } from "@components/_pages/ProposalContent";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import Link from "next/link";
import { FC } from "react";
import ProposalLayoutTweetRankOrPlaceholder from "./components/RankOrPlacehoder";
import { Tweet } from "./components/CustomTweet";
import ProposalLayoutLeaderboardRankOrPlaceholder from "../Leaderboard/components/RankOrPlaceholder";

interface ProposalLayoutTweetProps {
  proposal: Proposal;
  isMobile: boolean;
  chainName: string;
  contestAddress: string;
  contestStatus: ContestStatus;
  formattedVotingOpen: moment.Moment;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  handleVotingModalOpen?: () => void;
  toggleProposalSelection?: (proposalId: string) => void;
}

const extractTweetId = (url: string): string => {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : "";
};

const ProposalLayoutTweet: FC<ProposalLayoutTweetProps> = ({
  proposal,
  isMobile,
  chainName,
  contestAddress,
  contestStatus,
  formattedVotingOpen,
  commentLink,
  allowDelete,
  selectedProposalIds,
  handleVotingModalOpen,
  toggleProposalSelection,
}) => {
  const tweetUrl = proposal.metadataFields.stringArray[0];
  const tweetId = extractTweetId(tweetUrl);

  return (
    <div className="flex flex-col gap-6 p-2 bg-true-black rounded-2xl shadow-entry-card w-full border border-transparent hover:border-primary-3 transition-colors duration-300 ease-in-out">
      <div className="pl-2 items-center flex justify-between w-full">
        <div className="flex items-center gap-6">
          <ProposalLayoutTweetRankOrPlaceholder proposal={proposal} />
          <UserProfileDisplay
            ethereumAddress={proposal.authorEthereumAddress}
            size="small"
            textColor="text-neutral-9"
            shortenOnFallback
          />
        </div>
        {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
          <button
            onClick={handleVotingModalOpen}
            className="group min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
          >
            <img
              src="/contest/upvote.svg"
              width={16}
              height={16}
              alt="upvote"
              className="flex-shrink-0 transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:saturate-0"
            />
            <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
          </button>
        ) : null}
      </div>
      <div className="dark not-prose">
        <Tweet id={tweetId} apiUrl={`/api/tweet/${tweetId}`} />
      </div>
      <div className="mt-auto pl-2">
        <div className="flex gap-2 items-center">
          {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
            <button
              onClick={handleVotingModalOpen}
              className="group min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-positive-11 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
            >
              <img
                src="/contest/upvote.svg"
                width={16}
                height={16}
                alt="upvote"
                className="flex-shrink-0 transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:saturate-0"
              />
              <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
            </button>
          ) : (
            <p className="text-neutral-10 text-[14px] font-bold">
              voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}
            </p>
          )}
          <Link
            href={commentLink}
            className="min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-neutral-9  border border-neutral-9 hover:bg-neutral-9 hover:text-true-black transition-colors duration-300 ease-in-out"
            shallow
            scroll={false}
          >
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
            <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
          </Link>
          <div className="ml-auto">
            {allowDelete ? (
              <div className="relative w-4 h-4 cursor-pointer" onClick={() => toggleProposalSelection?.(proposal.id)}>
                <CheckIcon
                  className={`absolute inset-0 transform transition-all ease-in-out duration-300 
            ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
            text-positive-11 bg-white bg-transparent border border-positive-11 hover:text-positive-10 
            shadow-md hover:shadow-lg rounded-md`}
                />
                <TrashIcon
                  className={`absolute inset-0 transition-opacity duration-300 
            ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
            text-negative-11 bg-transparent hover:text-negative-10 transition-colors duration-300 ease-in-out`}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalLayoutTweet;
