import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { VOTES_PER_PAGE, useProposalVoters } from "@hooks/useProposalVoters";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import VoterRow from "./components/VoterRow";

interface ListProposalVotesProps {
  proposalId: string;
  votedAddresses: string[] | null;
  className?: string;
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

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposalId, votedAddresses, className }) => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;

  const { accumulatedVotesData, currentPage, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useProposalVoters(address, proposalId, chainId);

  const onLoadMoreCalledRef = useRef(false);
  const initialSkeletonCount = votedAddresses ? Math.min(votedAddresses.length, VOTES_PER_PAGE) : VOTES_PER_PAGE;
  const remainingItems =
    onLoadMoreCalledRef.current && votedAddresses ? votedAddresses.length - currentPage * VOTES_PER_PAGE : 0;
  const count =
    isFetchingNextPage && onLoadMoreCalledRef.current ? Math.min(remainingItems, VOTES_PER_PAGE) : initialSkeletonCount;

  useEffect(() => {
    onLoadMoreCalledRef.current = false;
  }, [proposalId]);

  const onLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
      onLoadMoreCalledRef.current = true;
    }
  };

  const addresses = Object.keys(accumulatedVotesData);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="flex flex-col h-full min-h-0">
        {votedAddresses ? (
          <>
            {isLoading && !onLoadMoreCalledRef.current ? (
              <LoadingSkeleton count={count} />
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-4 pr-6">
                  {addresses.map(address => (
                    <VoterRow
                      key={address}
                      votesPerAddress={accumulatedVotesData}
                      address={address}
                      addressesLength={addresses.length}
                      className={className}
                    />
                  ))}
                  {hasNextPage && (
                    <button className="flex gap-2 items-center" onClick={onLoadMore}>
                      <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
                      <ChevronUpIcon height={20} className="text-positive-11" />
                    </button>
                  )}
                  {isFetchingNextPage && onLoadMoreCalledRef.current ? <LoadingSkeleton count={count} /> : null}
                </div>
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
