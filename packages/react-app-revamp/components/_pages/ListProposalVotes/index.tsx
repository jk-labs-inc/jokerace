import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { VOTES_PER_PAGE, useProposalVotes } from "@hooks/useProposalVotes";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SimpleBar from "simplebar-react";
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
  const { accumulatedVotesData, currentPage, totalPages, setCurrentPage, isLoading, fetchVotesPerPage } =
    useProposalVotes(address, proposalId, chainId);
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

  const addresses = Object.keys(accumulatedVotesData);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex flex-col gap-5">
        {votedAddresses ? (
          <>
            {isLoading && !onLoadMoreCalledRef.current ? (
              <LoadingSkeleton count={count} />
            ) : (
              <div style={{ height: Math.min(addresses.length * 50, 450) }}>
                <SimpleBar style={{ maxHeight: "100%", height: "100%" }} autoHide={false}>
                  <div className="flex flex-col gap-4 pr-6">
                    {addresses.map(address => (
                      <VoterRow
                        key={address}
                        data={{
                          votesPerAddress: accumulatedVotesData,
                          addresses: [address],
                        }}
                      />
                    ))}
                  </div>
                </SimpleBar>
              </div>
            )}
            {isLoading && onLoadMoreCalledRef.current ? <LoadingSkeleton count={count} /> : null}
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
