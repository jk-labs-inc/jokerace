import { Proposal } from "@components/_pages/ProposalContent";
import CustomLink from "@components/UI/Link";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useTransitionRouter } from "next-view-transitions";
import { FC } from "react";
import ProposalContentProfile from "../../Profile";
import { Tweet } from "./components/CustomTweet";
import ProposalLayoutTweetRankOrPlaceholder from "./components/RankOrPlacehoder";

interface ProposalLayoutTweetProps {
  proposal: Proposal;
  proposalAuthorData: {
    name: string;
    avatar: string;
    isLoading: boolean;
    isError: boolean;
  };
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
  proposalAuthorData,
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
  const router = useTransitionRouter();

  const onVotingModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    handleVotingModalOpen?.();
  };

  const onCommentLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    router.push(commentLink);
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    toggleProposalSelection?.(proposal.id);
  };

  return (
    <CustomLink
      scroll={false}
      href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
      className="flex flex-col gap-4 p-2 bg-true-black rounded-2xl shadow-entry-card w-full border border-transparent hover:border-primary-3 transition-colors duration-300 ease-in-out"
    >
      <div className="pl-2 items-center flex justify-between w-full">
        <div className="flex items-center gap-6">
          <ProposalLayoutTweetRankOrPlaceholder proposal={proposal} />
          <ProposalContentProfile
            name={proposalAuthorData.name}
            avatar={proposalAuthorData.avatar}
            isLoading={proposalAuthorData.isLoading}
            isError={proposalAuthorData.isError}
            size="small"
            textColor="text-neutral-9"
          />
        </div>
        {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
          <button
            onClick={onVotingModalOpen}
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
      <div className="not-prose">
        <Tweet id={tweetId} apiUrl={`/api/tweet/${tweetId}`} />
      </div>
      <div className="mt-auto pl-2">
        <div className="flex gap-2 items-center">
          {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
            <button
              onClick={onVotingModalOpen}
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
          <button
            onClick={onCommentLinkClick}
            className="min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-neutral-9  border border-neutral-9 hover:bg-neutral-9 hover:text-true-black transition-colors duration-300 ease-in-out"
          >
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
            <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
          </button>
          <div className="ml-auto">
            {allowDelete ? (
              <button className="relative w-4 h-4 cursor-pointer" onClick={onDeleteClick}>
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
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </CustomLink>
  );
};

export default ProposalLayoutTweet;
