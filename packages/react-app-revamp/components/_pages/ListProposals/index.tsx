import Button from "@components/UI/Button";
import Loader from "@components/UI/Loader";
import ProposalContent from "@components/_pages/ProposalContent";
import { useContestStore } from "@hooks/useContest/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import moment from "moment";

export const ListProposals = () => {
  const { fetchProposalsPage } = useProposal();

  const {
    listProposalsIds,
    isPageProposalsLoading,
    isPageProposalsError,
    currentPagePaginationProposals,
    indexPaginationProposals,
    totalPagesPaginationProposals,
    listProposalsData,
  } = useProposalStore(state => state);
  const { votesOpen, contestPrompt } = useContestStore(state => state);

  const now = moment();
  const formattedVotingOpen = moment(votesOpen);

  if (isPageProposalsLoading && !Object.keys(listProposalsData)?.length) {
    return <Loader scale="component">Loading proposals...</Loader>;
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
                  <ProposalContent
                    id={id}
                    proposal={listProposalsData[id]}
                    prompt={contestPrompt}
                    votingOpen={votesOpen}
                  />
                </div>
              );
            });
        })()}
      </div>

      {isPageProposalsLoading && Object.keys(listProposalsData)?.length && (
        <Loader scale="component" classNameWrapper="my-3">
          Loading proposals...
        </Loader>
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
