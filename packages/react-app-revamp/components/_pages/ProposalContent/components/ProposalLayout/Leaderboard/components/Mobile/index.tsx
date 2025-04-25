import { Proposal } from "@components/_pages/ProposalContent";
import ProposalContentDeleteButton from "@components/_pages/ProposalContent/components/Buttons/Delete";
import ProposalContentProfile from "@components/_pages/ProposalContent/components/Profile";
import CustomLink from "@components/UI/Link";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useRouter } from "next/navigation";
import { FC } from "react";
import ProposalLayoutLeaderboardRankOrPlaceholder from "../RankOrPlaceholder";

interface ProposalLayoutLeaderboardMobileProps {
  proposal: Proposal;
  proposalAuthorData: {
    name: string;
    avatar: string;
    isLoading: boolean;
    isError: boolean;
  };
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
  proposalAuthorData,
  contestStatus,
  commentLink,
  allowDelete,
  selectedProposalIds,
  toggleProposalSelection,
  handleVotingModalOpen,
  chainName,
  contestAddress,
}) => {
  const router = useRouter();
  const entryTitle = proposal.metadataFields.stringArray[0];

  const navigateToCommentLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(commentLink);
  };

  const navigateToVotingModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleVotingModalOpen?.();
  };

  const navigateToProposal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`);
  };

  return (
    <CustomLink
      href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
      className="w-full flex flex-col min-h-20 gap-4 bg-true-black shadow-entry-card p-4 rounded-2xl border border-transparent"
    >
      <div className="flex items-center gap-6">
        <ProposalLayoutLeaderboardRankOrPlaceholder proposal={proposal} contestStatus={contestStatus} />
        <ProposalContentProfile
          name={proposalAuthorData.name}
          avatar={proposalAuthorData.avatar}
          isLoading={proposalAuthorData.isLoading}
          isError={proposalAuthorData.isError}
          textColor="text-neutral-10"
          size="extraSmall"
        />
        <div className="flex gap-2 items-center ml-auto" onClick={e => e.stopPropagation()}>
          <button
            onClick={navigateToCommentLink}
            className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px]  text-neutral-9  border border-neutral-9"
          >
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
            <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
          </button>
          {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
            <button
              onClick={navigateToVotingModal}
              className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-gradient-vote rounded-[16px] cursor-pointer text-true-black"
            >
              <img src="/contest/upvote-mobile.svg" width={11} height={15} alt="upvote" className="flex-shrink-0" />
              <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {allowDelete ? (
          <div onClick={e => e.stopPropagation()}>
            <ProposalContentDeleteButton
              proposalId={proposal.id}
              selectedProposalIds={selectedProposalIds}
              toggleProposalSelection={toggleProposalSelection}
            />
          </div>
        ) : (
          <div className="ml-[5px] h-6 w-6 mt-1" />
        )}
        <p className="text-[16px] text-neutral-11 font-bold normal-case">{entryTitle}</p>
        <div className="flex ml-auto" onClick={e => e.stopPropagation()}>
          <button
            onClick={navigateToProposal}
            className="text-neutral-10 hover:text-positive-11 transition-colors duration-300 ease-in-out"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </CustomLink>
  );
};

export default ProposalLayoutLeaderboardMobile;
