import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import ProposalContent from "@components/_pages/ProposalContent";
import { CheckIcon, TrashIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";

export const ListProposals = () => {
  const { address } = useAccount();
  const { fetchProposalsPage } = useProposal();
  const { deleteProposal, isLoading: isDeleteInProcess, isSuccess: isDeleteSuccess } = useDeleteProposal();
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
  const allowDelete =
    (contestStatus === ContestStatus.SubmissionOpen || contestStatus === ContestStatus.VotingOpen) &&
    address === contestAuthorEthereumAddress;
  const [deletingProposalIds, setDeletingProposalIds] = useState<string[]>([]);
  const [selectedProposalIds, setSelectedProposalIds] = useState<string[]>([]);
  const showDeleteButton = selectedProposalIds.length > 0 && !isDeleteInProcess;

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
              if (deletingProposalIds.includes(id) && isDeleteInProcess) {
                return (
                  <SkeletonTheme baseColor="#000000" highlightColor="#FF78A9" duration={1} key={id}>
                    <Skeleton
                      borderRadius={10}
                      className="flex flex-col w-full h-96 md:h-56 animate-appear rounded-[10px] border border-neutral-11 mt-3"
                    />
                  </SkeletonTheme>
                );
              }
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
                  {allowDelete && (
                    <div
                      className="absolute cursor-pointer -top-0 right-0 -mt-4 z-10"
                      onClick={() => toggleProposalSelection(id)}
                    >
                      <div className="relative h-6 w-6">
                        <CheckIcon
                          className={`absolute transform transition-all ease-in-out duration-300 
                           ${selectedProposalIds.includes(id) ? "opacity-100" : "opacity-0"}
                          h-8 text-primary-10 bg-white bg-true-black border border-neutral-11 hover:text-primary-9 
                          shadow-md hover:shadow-lg rounded-md`}
                        />

                        <TrashIcon
                          className={`absolute transition-opacity duration-300  ${
                            selectedProposalIds.includes(id) ? "opacity-0" : "opacity-100"
                          }
                           h-8 text-negative-11 bg-true-black hover:text-negative-10`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            });
        })()}
      </div>

      {showDeleteButton && (
        <div className="flex sticky bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <ButtonV3
            size="extraLarge"
            color="bg-gradient-withdraw mx-auto animate-appear"
            onClick={onDeleteSelectedProposals}
          >
            Delete {selectedProposalIds.length} {selectedProposalIds.length === 1 ? "submission" : "submissions"}
          </ButtonV3>
        </div>
      )}

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
