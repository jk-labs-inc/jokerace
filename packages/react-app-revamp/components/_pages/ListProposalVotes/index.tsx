import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { VOTES_PER_PAGE, useProposalVotes } from "@hooks/useProposalVotes";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SimpleBar from "simplebar-react";
import VoterRow from "./components/VoterRow";

interface ListProposalVotesProps {
  proposalId: string;
  votedAddresses: string[] | null;
  isAnyoneCanVote: boolean;
  isVotingOpen: boolean;
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

export const ListProposalVotes: FC<ListProposalVotesProps> = ({
  proposalId,
  votedAddresses,
  isAnyoneCanVote,
  isVotingOpen,
}) => {
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
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const simpleBarRef = useRef<any>(null);

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
  const voterListHeightEqualOrMax = isAnyoneCanVote ? 40 : 50;
  const voterListHeightMax = isAnyoneCanVote ? 230 : 250;
  const voterListHeightCalculated = addresses.length >= 5 ? voterListHeightEqualOrMax : voterListHeightMax;

  useEffect(() => {
    const checkForScrollbar = () => {
      if (simpleBarRef.current) {
        const scrollElement = simpleBarRef.current.getScrollElement();
        const hasVerticalScrollbar = scrollElement.scrollHeight > scrollElement.clientHeight;
        setHasScrollbar(hasVerticalScrollbar);
      }
    };

    if (simpleBarRef.current) {
      const scrollElement = simpleBarRef.current.getScrollElement();
      scrollElement.addEventListener("scroll", checkForScrollbar);
      checkForScrollbar();
    }

    return () => {
      if (simpleBarRef.current) {
        const scrollElement = simpleBarRef.current.getScrollElement();
        scrollElement.removeEventListener("scroll", checkForScrollbar);
      }
    };
  }, [addresses]);

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="flex flex-col">
        {votedAddresses ? (
          <>
            {isLoading && !onLoadMoreCalledRef.current ? (
              <LoadingSkeleton count={count} />
            ) : (
              <div className="flex flex-col gap-7">
                <div
                  style={{
                    height: `${Math.min(addresses.length, 5) * voterListHeightCalculated}px`,
                  }}
                >
                  <SimpleBar ref={simpleBarRef} style={{ maxHeight: "100%", height: "100%" }} autoHide={false}>
                    <div className={`flex flex-col gap-4 ${hasScrollbar ? "pr-6" : ""}`}>
                      {addresses.map(address => (
                        <VoterRow
                          key={address}
                          data={{
                            votesPerAddress: accumulatedVotesData,
                            address: address,
                            addressesLength: addresses.length,
                          }}
                        />
                      ))}
                      {isLoading && onLoadMoreCalledRef.current ? <LoadingSkeleton count={count} /> : null}
                    </div>
                  </SimpleBar>
                </div>
                {showLoadMore && (
                  <button className="flex gap-2 items-center pl-2" onClick={onLoadMore}>
                    <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
                    <ChevronUpIcon height={20} className="text-positive-11" />
                  </button>
                )}
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
