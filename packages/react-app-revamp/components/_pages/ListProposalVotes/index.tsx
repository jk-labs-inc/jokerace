import Collapsible from "@components/UI/Collapsible";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ArrowPathIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { VOTES_PER_PAGE, useProposalVotes } from "@hooks/useProposalVotes";
import { usePathname } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import VoterRow from "./components/VoterRow";

interface ListProposalVotesProps {
  proposalId: string;
  votedAddresses: string[] | null;
}

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

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposalId, votedAddresses }) => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const {
    accumulatedVotesData,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    fetchVotesPerPage,
    addressesVoted,
    refreshData,
  } = useProposalVotes(address, proposalId, chainId);
  const onLoadMoreCalledRef = useRef(false);
  const initialSkeletonCount = votedAddresses ? Math.min(votedAddresses.length, VOTES_PER_PAGE) : VOTES_PER_PAGE;
  const remainingItems =
    onLoadMoreCalledRef.current && votedAddresses ? votedAddresses.length - currentPage * VOTES_PER_PAGE : 0;
  const count =
    isLoading && onLoadMoreCalledRef.current ? Math.min(remainingItems, VOTES_PER_PAGE) : initialSkeletonCount;
  const showLoadMore = currentPage < totalPages - 1;

  useEffect(() => {
    onLoadMoreCalledRef.current = false;
  }, [proposalId]);

  const onLoadMore = () => {
    if (currentPage < totalPages - 1) {
      fetchVotesPerPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
      onLoadMoreCalledRef.current = true;
    }
  };

  const onRefreshData = () => {
    onLoadMoreCalledRef.current = false;
    refreshData();
  };

  const addresses = Object.keys(accumulatedVotesData);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11 font-bold">voters ({addressesVoted.length})</p>
      </div>
      <div className="flex flex-col gap-5">
        {votedAddresses ? (
          <>
            <div className="overflow-auto">
              {isLoading && !onLoadMoreCalledRef.current ? (
                <LoadingSkeleton count={count} />
              ) : (
                <AutoSizer disableHeight>
                  {({ width }: { width: number }) => (
                    <List
                      height={Math.min(addresses.length * 50, 400)}
                      itemCount={addresses.length}
                      itemSize={50}
                      width={width}
                      itemData={{ votesPerAddress: accumulatedVotesData, addresses }}
                    >
                      {VoterRow}
                    </List>
                  )}
                </AutoSizer>
              )}
              {isLoading && onLoadMoreCalledRef.current ? <LoadingSkeleton count={count} /> : null}
            </div>
            {showLoadMore && (
              <div className="flex gap-2 items-center cursor-pointer" onClick={onLoadMore}>
                <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
                <button
                  className="transition-transform duration-500 ease-in-out transform 
            rotate-180"
                >
                  <ChevronUpIcon height={20} className="text-positive-11" />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-[16px] text-negative-11 font-bold">
            ruh-roh! an error occurred when retrieving votes for this proposal; try refreshing the page.
          </p>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default ListProposalVotes;
