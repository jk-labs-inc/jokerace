import Button from "@components/UI/Button";
import ProposalContent from "@components/_pages/ProposalContent";
import { TrashIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";

export const ListProposals = () => {
  const { address } = useAccount();
  const { fetchProposalsPage } = useProposal();
  const { deleteProposal, isProposalDeleted } = useDeleteProposal();
  const {
    listProposalsIds,
    isPageProposalsLoading,
    isPageProposalsError,
    currentPagePaginationProposals,
    indexPaginationProposals,
    totalPagesPaginationProposals,
    listProposalsData,
  } = useProposalStore(state => state);
  const { votesOpen, contestAuthorEthereumAddress } = useContestStore(state => state);
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const [deletedProposals, setDeletedProposals] = useState<Record<string, boolean>>({});
  const [isFetchingDeletedStatus, setIsFetchingDeletedStatus] = useState(false);
  const [hasFetchedDeletedStatus, setHasFetchedDeletedStatus] = useState(false);
  const allowDelete = contestStatus === ContestStatus.SubmissionOpen && address === contestAuthorEthereumAddress;
  const shouldFetchDeletedStatus =
    (contestStatus === ContestStatus.SubmissionOpen || contestStatus === ContestStatus.VotingOpen) &&
    !isFetchingDeletedStatus;

  // useEffect(() => {
  //   const fetchDeletedStatus = async () => {
  //     setIsFetchingDeletedStatus(true);
  //     const deletedStatus: Record<string, boolean> = {};

  //     for (const id of Object.keys(listProposalsData)) {
  //       const isDeleted = await isProposalDeleted(id);
  //       deletedStatus[id] = Boolean(isDeleted);
  //     }

  //     setDeletedProposals(deletedStatus);
  //     setIsFetchingDeletedStatus(false);
  //     setHasFetchedDeletedStatus(true);
  //   };

  //   if (shouldFetchDeletedStatus) {
  //     fetchDeletedStatus();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [listProposalsData, shouldFetchDeletedStatus]);

  const onDeleteProposal = async (proposalId: string) => {
    await deleteProposal(proposalId);
  };

  if (isPageProposalsLoading && !Object.keys(listProposalsData)?.length) {
    return (
      <SkeletonTheme baseColor="#000000" highlightColor="#FFE25B" duration={1}>
        <Skeleton
          count={listProposalsIds.length}
          borderRadius={10}
          className="flex flex-col h-96 md:h-56 animate-appear border border-neutral-11  mb-3"
        />
      </SkeletonTheme>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {(() => {
          let rank = 0;
          let lastVotes: number | null = null;

          return Object.keys(listProposalsData)
            .sort((a, b) => listProposalsData[b].votes - listProposalsData[a].votes)
            .map(id => {
              const votes = listProposalsData[id].votes;

              if (votes !== lastVotes) {
                rank++;
                lastVotes = votes;
              }

              return (
                <div key={id} className="relative">
                  {votes > 0 && (
                    <div className="absolute -top-0 left-0 -mt-6 -ml-6 w-12 z-10 h-12 rounded-full bg-true-black flex items-center justify-center text-[24px] font-bold text-neutral-11 border border-neutral-11">
                      {rank}
                    </div>
                  )}
                  <ProposalContent id={id} proposal={listProposalsData[id]} votingOpen={votesOpen} />
                  {allowDelete && hasFetchedDeletedStatus && !deletedProposals[id] && (
                    <div
                      className="absolute cursor-pointer -top-0 right-0 -mt-4 -mr-2 w-6 z-10 h-6 bg-true-black flex items-center justify-center text-[24px] font-bold text-neutral-11"
                      onClick={() => onDeleteProposal(id)}
                    >
                      <TrashIcon className="h-6 text-negative-11 hover:text-negative-10 transition-colors duration-300" />
                    </div>
                  )}
                </div>
              );
            });
        })()}
      </div>

      {isPageProposalsLoading && Object.keys(listProposalsData)?.length && (
        <SkeletonTheme baseColor="#000000" highlightColor="#FFE25B" duration={1}>
          <Skeleton
            borderRadius={10}
            count={3}
            className="flex flex-col w-full h-96 md:h-56 animate-appear rounded-[10px] border border-neutral-11 mt-3"
          />
        </SkeletonTheme>
      )}

      {Object.keys(listProposalsData)?.length < listProposalsIds.length && !isPageProposalsLoading && (
        <div className="pt-8 flex animate-appear">
          <Button
            intent="neutral-outline"
            scale="sm"
            className="mx-auto animate-appear"
            onClick={() =>
              fetchProposalsPage(
                currentPagePaginationProposals + 1,
                indexPaginationProposals[currentPagePaginationProposals + 1],
                totalPagesPaginationProposals,
              )
            }
          >
            {isPageProposalsError ? "Try again" : "Show more proposals"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListProposals;
