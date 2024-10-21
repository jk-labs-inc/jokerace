import { Proposal } from "@components/_pages/ProposalContent";
import { transform } from "@components/_pages/ProposalContent/utils/markdown";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import Link from "next/link";
import { FC, useState } from "react";

interface ProposalLayoutLeaderboardProps {
  proposal: Proposal;
  isMobile: boolean;
  chainName: string;
  contestAddress: string;
  contestStatus: string;
  formattedVotingOpen: moment.Moment;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  handleVotingModalOpen?: () => void;
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalLayoutLeaderboard: FC<ProposalLayoutLeaderboardProps> = ({
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
  const [isContentHidden, setIsContentHidden] = useState(true);
  const entryTitle = proposal.metadataFields.stringArray[0];

  const handleToggleVisibility = () => {
    setIsContentHidden(!isContentHidden);
  };

  const renderRank = () => {
    if (proposal.rank) {
      if (proposal.rank === 1) {
        return <img src="/contest/ranks/first.svg" alt="Rank 1" className="w-10 h-10 object-contain" />;
      } else {
        return (
          <div className="w-10 h-10 flex items-center justify-center">
            <p className="text-[16px] text-neutral-11 font-bold">{proposal.rank}</p>
          </div>
        );
      }
    } else {
      return (
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-10 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-10"></span>
          </span>
        </div>
      );
    }
  };

  return (
    <div className={`flex gap-6 ${isContentHidden ? "items-center" : "items-start"}`}>
      {allowDelete && (
        <div
          className="-ml-12 h-6 w-6 relative cursor-pointer mt-1"
          onClick={() => toggleProposalSelection?.(proposal.id)}
        >
          <CheckIcon
            className={`absolute top-0 left-0 transform transition-all ease-in-out duration-300 
                    ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
                    h-6 w-6 text-positive-11 bg-white bg-true-black border border-positive-11 hover:text-positive-10 
                    shadow-md hover:shadow-lg rounded-md`}
          />
          <TrashIcon
            className={`absolute top-0 left-0 transition-opacity duration-300 
                    ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
                    h-6 w-6 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out`}
          />
        </div>
      )}
      <div className="w-full flex flex-col min-h-16 gap-6 bg-true-black shadow-entry-card p-4 rounded-2xl border border-transparent hover:border-primary-3 transition-colors duration-300 ease-in-out">
        <div className="flex justify-between items-center">
          <div className="flex gap-12 items-center">
            <div className="flex gap-8 items-center">
              {renderRank()}
              <UserProfileDisplay
                textColor="text-neutral-10"
                ethereumAddress={proposal.authorEthereumAddress}
                size="small"
                shortenOnFallback
              />
            </div>
            <p className="text-[16px] text-neutral-11 font-bold normal-case">{entryTitle}</p>
          </div>
          <div className="flex gap-6 items-center ml-auto">
            {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
              <button
                onClick={handleVotingModalOpen}
                className="min-w-16 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
              >
                <img src="/contest/upvote.svg" width={24} height={24} alt="upvote" className="flex-shrink-0" />
                <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
              </button>
            ) : null}
            <ChevronDownIcon
              className={`w-6 h-6 text-positive-11 cursor-pointer transition-transform duration-300 ${isContentHidden ? "" : "transform rotate-180"}`}
              onClick={handleToggleVisibility}
            />
          </div>
        </div>
        {!isContentHidden && (
          <div className="flex flex-col gap-4">
            <div className="pl-4 animate-reveal">
              <Interweave
                className="prose prose-invert interweave-container inline-block w-full text-neutral-9"
                content={proposal.content}
                transform={transform}
                tagName="div"
              />
            </div>
            <div className="pl-4 flex gap-4 items-center">
              {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
                <button
                  onClick={handleVotingModalOpen}
                  className="min-w-16 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-positive-11 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
                >
                  <img src="/contest/upvote.svg" width={24} height={24} alt="upvote" className="flex-shrink-0" />
                  <p className="text-[16px] font-bold flex-grow text-center">
                    {formatNumberAbbreviated(proposal.votes)}
                  </p>
                </button>
              ) : (
                <p className="text-neutral-10 text-[16px] font-bold">
                  voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}
                </p>
              )}
              <Link
                href={commentLink}
                className="min-w-16 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-neutral-9  border border-neutral-9 hover:bg-neutral-9 hover:text-true-black transition-colors duration-300 ease-in-out"
                shallow
                scroll={false}
              >
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 flex-shrink-0" />
                <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalLayoutLeaderboard;
