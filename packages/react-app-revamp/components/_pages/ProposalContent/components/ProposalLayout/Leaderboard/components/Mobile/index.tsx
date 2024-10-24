import { Proposal } from "@components/_pages/ProposalContent";
import ProposalContentDeleteButton from "@components/_pages/ProposalContent/components/Buttons/Delete";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import Link from "next/link";
import { FC } from "react";
import ProposalLayoutLeaderboardRankOrPlaceholder from "../RankOrPlaceholder";

interface ProposalLayoutLeaderboardMobileProps {
  proposal: Proposal;
  contestStatus: ContestStatus;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  chainName: string;
  contestAddress: string;
  toggleProposalSelection?: (proposalId: string) => void;
  handleVotingModalOpen?: () => void;
}

const ProposalLayoutLeaderboardMobile: FC<ProposalLayoutLeaderboardMobileProps> = ({
  proposal,
  contestStatus,
  commentLink,
  allowDelete,
  selectedProposalIds,
  toggleProposalSelection,
  handleVotingModalOpen,
  chainName,
  contestAddress,
}) => {
  const entryTitle = proposal.metadataFields.stringArray[0];

  return (
    <div className="w-full flex flex-col min-h-20 gap-4 bg-true-black shadow-entry-card p-4 rounded-2xl border border-transparent">
      <div className="flex items-center gap-6">
        <ProposalLayoutLeaderboardRankOrPlaceholder proposal={proposal} contestStatus={contestStatus} />
        <UserProfileDisplay
          textColor="text-neutral-10"
          ethereumAddress={proposal.authorEthereumAddress}
          size="extraSmall"
          shortenOnFallback
        />
        <div className="flex gap-2 items-center ml-auto ">
          <Link
            href={commentLink}
            className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px]  text-neutral-9  border border-neutral-9"
            shallow
            scroll={false}
          >
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
            <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
          </Link>
          {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
            <button
              onClick={handleVotingModalOpen}
              className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2"
            >
              <img src="/contest/upvote.svg" width={16} height={16} alt="upvote" className="flex-shrink-0" />
              <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {allowDelete ? (
          <ProposalContentDeleteButton
            proposalId={proposal.id}
            selectedProposalIds={selectedProposalIds}
            toggleProposalSelection={toggleProposalSelection}
          />
        ) : (
          <div className="ml-[5px] h-6 w-6 mt-1" />
        )}
        <p className="text-[16px] text-neutral-11 font-bold normal-case">{entryTitle}</p>
        <div className="flex ml-auto">
          <Link
            href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
            className="text-neutral-10 hover:text-positive-11 transition-colors duration-300 ease-in-out"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProposalLayoutLeaderboardMobile;
