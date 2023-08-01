import Collapsible from "@components/UI/Collapsible";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useProposalStore } from "@hooks/useProposal/store";
import useProposalVotes from "@hooks/useProposalVotes";
import { useProposalVotesStore } from "@hooks/useProposalVotes/store";
import { FC, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Proposal } from "../ProposalContent";

interface ListProposalVotesProps {
  proposalId: string;
  proposal: Proposal;
}

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposal, proposalId }) => {
  const { isLoading, fetchVotesPage } = useProposalVotes(proposalId);
  const { listProposalsData } = useProposalStore(state => state);
  const placeholders = new Array(5).fill(null);
  const {
    votesPerAddress,
    isPageVotesLoading,
    currentPagePaginationVotes,
    indexPaginationVotes,
    totalPagesPaginationVotes,
    hasPaginationVotesNextPage,
  } = useProposalVotesStore(state => state);
  const [isVotersOpen, setIsVotersOpen] = useState(true);
  const [isLoadMoreOpen, setIsLoadMoreOpen] = useState(false);

  const onLoadMore = () => {
    setIsLoadMoreOpen(true);
    fetchVotesPage(
      currentPagePaginationVotes + 1,
      indexPaginationVotes[currentPagePaginationVotes + 1],
      totalPagesPaginationVotes,
    );
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex gap-4 items-center mb-8">
        <p className="text-[24px] text-neutral-11 font-bold">voters</p>
        <button
          onClick={() => setIsVotersOpen(!isVotersOpen)}
          className={`transition-transform duration-500 ease-in-out transform ${isVotersOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      <Collapsible isOpen={isVotersOpen}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 md:w-[350px]">
            {isLoading || (isPageVotesLoading && Object.keys(listProposalsData)?.length > 1) ? (
              placeholders.map((_, index, self) => (
                <div
                  key={index}
                  className={`flex justify-between items-center pb-3 ${
                    index !== self.length - 1 ? "border-b border-neutral-10" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Skeleton circle height={32} width={32} />
                    <Skeleton width={100} height={16} className="mt-2" />
                  </div>

                  <Skeleton width={50} height={16} />
                </div>
              ))
            ) : (
              <>
                {Object.keys(votesPerAddress).map((address: string, index, self) => (
                  <div
                    key={address}
                    className={`flex justify-between items-end text-[16px] font-bold pb-3 ${
                      index !== self.length - 1 ? "border-b border-neutral-10" : ""
                    }`}
                  >
                    <EtheuremAddress ethereumAddress={address} shortenOnFallback={true} displayLensProfile={true} />
                    <p>{formatNumber(votesPerAddress[address].votes)} votes</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {hasPaginationVotesNextPage && !isPageVotesLoading && (
            <div className="flex gap-2 items-center mb-8">
              <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
              <button
                onClick={onLoadMore}
                className={`transition-transform duration-500 ease-in-out transform ${
                  isLoadMoreOpen ? "" : "rotate-180"
                }`}
              >
                <ChevronUpIcon height={20} className="text-positive-11" />
              </button>
            </div>
          )}
        </div>
      </Collapsible>
    </SkeletonTheme>
  );
};

export default ListProposalVotes;
