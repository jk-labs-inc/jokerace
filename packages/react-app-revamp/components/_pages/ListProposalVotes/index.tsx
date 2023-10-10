import Collapsible from "@components/UI/Collapsible";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronUpIcon } from "@heroicons/react/outline";
import useProposalVotes, { VOTES_PER_PAGE } from "@hooks/useProposalVotes";
import { useProposalVotesStore } from "@hooks/useProposalVotes/store";
import { FC, useCallback, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ListProposalVotesProps {
  proposalId: string;
}

const VotersList: FC<{ votesPerAddress: any }> = ({ votesPerAddress }) => (
  <div className="flex flex-col gap-4 md:w-[350px]">
    {Object.keys(votesPerAddress).map((address: string, index, self) => (
      <div
        key={address}
        className={`flex justify-between items-end text-[16px] font-bold pb-3 ${
          index !== self.length - 1 ? "border-b border-neutral-10" : ""
        }`}
      >
        <EthereumAddress ethereumAddress={address} shortenOnFallback={true} />
        <p>{formatNumber(votesPerAddress[address].votes)} votes</p>
      </div>
    ))}
  </div>
);

const LoadingSkeleton: FC<{ count: number }> = ({ count }) => (
  <div className="flex flex-col gap-4 md:w-[350px]">
    {new Array(count).fill(null).map((_, index) => (
      <div key={index} className="flex justify-between items-center pb-3 border-b border-neutral-10">
        <div className="flex items-center gap-2">
          <Skeleton circle height={32} width={32} />
          <Skeleton width={100} height={16} className="mt-2" />
        </div>
        <Skeleton width={50} height={16} />
      </div>
    ))}
  </div>
);

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposalId }) => {
  const { fetchVotesPage } = useProposalVotes(proposalId);
  const {
    isPageVotesLoading,
    votesPerAddress,
    hasPaginationVotesNextPage,
    votedAddressesCount,
    currentPagePaginationVotes,
    indexPaginationVotes,
    totalPagesPaginationVotes,
  } = useProposalVotesStore(state => state);
  const [isVotersOpen, setIsVotersOpen] = useState(true);
  const onLoadMoreCalledRef = useRef(false);
  const remainingItems = onLoadMoreCalledRef.current
    ? votedAddressesCount - currentPagePaginationVotes * VOTES_PER_PAGE
    : 0;
  const skeletonsCount = isPageVotesLoading
    ? onLoadMoreCalledRef.current
      ? Math.min(remainingItems, VOTES_PER_PAGE)
      : 5
    : 0;

  const toggleVotersOpen = useCallback(() => {
    setIsVotersOpen(prev => !prev);
  }, []);

  const onLoadMore = useCallback(() => {
    fetchVotesPage(
      currentPagePaginationVotes + 1,
      indexPaginationVotes[currentPagePaginationVotes + 1],
      totalPagesPaginationVotes,
    );
    onLoadMoreCalledRef.current = true;
  }, [currentPagePaginationVotes, fetchVotesPage, indexPaginationVotes, totalPagesPaginationVotes]);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11 font-bold">voters</p>
        <button
          onClick={toggleVotersOpen}
          className={`transition-transform duration-500 ease-in-out transform ${isVotersOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      <Collapsible isOpen={isVotersOpen}>
        <div className="flex flex-col gap-5 mb-12 sm:mb-0">
          <div className="flex flex-col gap-4 md:w-[350px]">
            <VotersList votesPerAddress={votesPerAddress} />
            {isPageVotesLoading && <LoadingSkeleton count={skeletonsCount} />}
          </div>
          {hasPaginationVotesNextPage && !isPageVotesLoading && (
            <div className="flex gap-2 items-center mb-8">
              <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
              <button
                onClick={onLoadMore}
                className="transition-transform duration-500 ease-in-out transform 
              rotate-180"
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
