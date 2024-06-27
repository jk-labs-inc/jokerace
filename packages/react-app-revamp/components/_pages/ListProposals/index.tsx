import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import ProposalContent from "@components/_pages/ProposalContent";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import useProposal, { PROPOSALS_PER_PAGE } from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";

const ProposalSkeleton = ({ count, highlightColor }: { count?: number; highlightColor: string }) => (
  <SkeletonTheme baseColor="#141414" highlightColor={highlightColor} duration={1}>
    <Skeleton
      borderRadius={10}
      count={count}
      className="flex flex-col w-full h-80 animate-appear rounded-[10px] mt-3"
    />
  </SkeletonTheme>
);

export const ListProposals = () => {
  const { address } = useAccount();
  const { fetchProposalsPage } = useProposal();
  const { deleteProposal, isLoading: isDeleteInProcess, isSuccess: isDeleteSuccess } = useDeleteProposal();
  const {
    listProposalsIds,
    isPageProposalsLoading,
    initialMappedProposalIds,
    currentPagePaginationProposals,
    indexPaginationProposals,
    submissionsCount,
    totalPagesPaginationProposals,
    listProposalsData,
  } = useProposalStore(state => state);
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const allowDelete =
    (contestStatus === ContestStatus.SubmissionOpen || contestStatus === ContestStatus.VotingOpen) &&
    address === contestAuthorEthereumAddress;
  const [deletingProposalIds, setDeletingProposalIds] = useState<string[]>([]);
  const [selectedProposalIds, setSelectedProposalIds] = useState<string[]>([]);
  const showDeleteButton = selectedProposalIds.length > 0 && !isDeleteInProcess;
  const remainingProposalsToLoad = submissionsCount - listProposalsData.length;
  const skeletonRemainingLoaderCount = Math.min(remainingProposalsToLoad, PROPOSALS_PER_PAGE);

  const onDeleteSelectedProposals = async () => {
    setDeletingProposalIds(selectedProposalIds);
    await deleteProposal(selectedProposalIds);
    if (isDeleteSuccess) {
      setDeletingProposalIds([]);
    }
    setSelectedProposalIds([]);
  };

  const toggleProposalSelection = (proposalId: string) => {
    setSelectedProposalIds(prevIds => {
      if (prevIds.includes(proposalId)) {
        return prevIds.filter(id => id !== proposalId);
      } else {
        if (prevIds.length >= 50) {
          alert("You can only select up to 50 proposals in one take.");
          return prevIds;
        }
        return [...prevIds, proposalId];
      }
    });
  };

  if (isPageProposalsLoading && !listProposalsData.length) {
    return (
      <ProposalSkeleton
        count={listProposalsIds.length > PROPOSALS_PER_PAGE ? PROPOSALS_PER_PAGE : listProposalsIds.length}
        highlightColor="#FFE25B"
      />
    );
  }

  return (
    <InfiniteScroll
      className="infiniteScroll"
      dataLength={listProposalsData.length}
      next={() =>
        fetchProposalsPage(
          currentPagePaginationProposals + 1,
          indexPaginationProposals[currentPagePaginationProposals + 1],
          totalPagesPaginationProposals,
          initialMappedProposalIds,
        )
      }
      hasMore={listProposalsData.length < submissionsCount}
      loader={<ProposalSkeleton count={skeletonRemainingLoaderCount} highlightColor="#FFE25B" />}
    >
      <div className="flex flex-col gap-8">
        {listProposalsData.map((proposal, index) => {
          if (deletingProposalIds.includes(proposal.id) && isDeleteInProcess) {
            return <ProposalSkeleton key={proposal.id} highlightColor="#FF78A9" />;
          }
          return (
            <ProposalContent
              key={index}
              proposal={{
                id: proposal.id,
                authorEthereumAddress: proposal.author,
                content: proposal.description,
                exists: proposal.exists,
                isContentImage: proposal.isContentImage,
                tweet: proposal.tweet,
                votes: proposal.netVotes,
                rank: proposal.rank,
                isTied: proposal.isTied,
                commentsCount: proposal.commentsCount,
              }}
              allowDelete={allowDelete}
              selectedProposalIds={selectedProposalIds}
              toggleProposalSelection={toggleProposalSelection}
            />
          );
        })}
      </div>

      {showDeleteButton && (
        <div className="flex sticky bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <ButtonV3
            size={ButtonSize.EXTRA_LARGE}
            colorClass="bg-gradient-withdraw mx-auto animate-appear"
            onClick={onDeleteSelectedProposals}
          >
            Delete {selectedProposalIds.length} {selectedProposalIds.length === 1 ? "submission" : "submissions"}
          </ButtonV3>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default ListProposals;
