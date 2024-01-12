import Collapsible from "@components/UI/Collapsible";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronUpIcon, RefreshIcon } from "@heroicons/react/outline";
import { VOTES_PER_PAGE, useProposalVotes } from "@hooks/useProposalVotes";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ListProposalVotesProps {
  proposalId: string;
}

const VotersList: FC<{ votesPerAddress: any }> = ({ votesPerAddress }) => {
  return (
    <div className="flex flex-col gap-4 md:w-[350px]">
      {Object.keys(votesPerAddress).map((address: string, index, self) => (
        <div
          key={address}
          className={`flex justify-between items-end text-[16px] font-bold pb-3 ${
            index !== self.length - 1 ? "border-b border-neutral-10" : ""
          }`}
        >
          <UserProfileDisplay ethereumAddress={address} shortenOnFallback={true} />
          <p>{formatNumber(votesPerAddress[address])} votes</p>
        </div>
      ))}
    </div>
  );
};

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
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const {
    accumulatedVotesData,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    addressesVoted,
    fetchVotesPerPage,
    refreshData,
  } = useProposalVotes(address, proposalId, chainId);
  const onLoadMoreCalledRef = useRef(false);
  const remainingItems = onLoadMoreCalledRef.current ? addressesVoted.length - currentPage * VOTES_PER_PAGE : 0;
  const count = isLoading && onLoadMoreCalledRef.current ? Math.min(remainingItems, VOTES_PER_PAGE) : 5;
  const [isVotersOpen, setIsVotersOpen] = useState(true);

  useEffect(() => {
    onLoadMoreCalledRef.current = false;
  }, [proposalId]);

  const toggleVotersOpen = useCallback(() => {
    setIsVotersOpen(prev => !prev);
  }, []);

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

        {isVotersOpen ? (
          <div onClick={onRefreshData} className="standalone-pwa cursor-pointer">
            <RefreshIcon className="w-6 h-6 m-auto" />
          </div>
        ) : null}
      </div>
      <Collapsible isOpen={isVotersOpen}>
        <div className="flex flex-col gap-5 mb-12 sm:mb-0">
          <div className="flex flex-col gap-4 md:w-[350px]">
            {isLoading && !onLoadMoreCalledRef.current ? (
              <LoadingSkeleton count={count} />
            ) : (
              <VotersList votesPerAddress={accumulatedVotesData} />
            )}
            {isLoading && onLoadMoreCalledRef.current ? <LoadingSkeleton count={count} /> : null}
          </div>
          {currentPage < totalPages - 1 && !isLoading && (
            <div className="flex gap-2 items-center mb-8 cursor-pointer" onClick={onLoadMore}>
              <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
              <button
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
