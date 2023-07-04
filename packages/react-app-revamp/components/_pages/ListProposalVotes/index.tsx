import Button from "@components/UI/Button";
import Collapsible from "@components/UI/Collapsible";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import Loader from "@components/UI/Loader";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useProposalStore } from "@hooks/useProposal/store";
import useProposalVotes from "@hooks/useProposalVotes";
import { useProposalVotesStore } from "@hooks/useProposalVotes/store";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import { Proposal } from "../ProposalContent";

interface ListProposalVotesProps {
  proposalId: string;
  proposal: Proposal;
}

export const ListProposalVotes: FC<ListProposalVotesProps> = ({ proposal, proposalId }) => {
  const accountData = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { isLoading, isSuccess, isError, retry, fetchVotesPage } = useProposalVotes(proposalId);
  const { listProposalsData } = useProposalStore(state => state);
  const {
    votesPerAddress,
    isPageVotesLoading,
    currentPagePaginationVotes,
    isPageVotesError,
    indexPaginationVotes,
    totalPagesPaginationVotes,
    hasPaginationVotesNextPage,
  } = useProposalVotesStore(state => state);
  const [isTopVotersOpen, setIsTopVotersOpen] = useState(true);
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
    <>
      <div className="flex gap-4 items-center mb-8">
        <p className="text-[24px] text-neutral-11 font-bold">top voters</p>
        <button
          onClick={() => setIsTopVotersOpen(!isTopVotersOpen)}
          className={`transition-transform duration-500 ease-in-out transform ${isTopVotersOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      {isSuccess && !isLoading && (
        <Collapsible isOpen={isTopVotersOpen}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 md:w-[350px]">
              {Object.keys(votesPerAddress)
                .sort((a, b) => votesPerAddress[b].votes - votesPerAddress[a].votes) // Sorting here
                .map((address: string, index, self) => (
                  <div
                    key={address}
                    className={`flex justify-between items-end text-[16px] font-bold pb-3 ${
                      index !== self.length - 1 ? "border-b border-neutral-10" : ""
                    }`}
                  >
                    <EtheuremAddress ethereumAddress={address} shortenOnFallback={true} displayLensProfile={true} />
                    <p>{new Intl.NumberFormat().format(parseFloat(votesPerAddress[address].votes.toFixed(2)))} votes</p>
                  </div>
                ))}
            </div>

            {isPageVotesLoading && Object.keys(listProposalsData)?.length > 1 && (
              <div className="mr-auto mt-0">
                <Loader scale="component" classNameWrapper="my-3">
                  Loading votes...
                </Loader>
              </div>
            )}

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
      )}

      {isLoading && (
        <div className="animate-appear md:w-[350px]">
          <Loader classNameWrapper={!isLoading ? "hidden" : ""} scale="component">
            Loading votes, one moment please...{" "}
          </Loader>
        </div>
      )}
    </>
  );
};

export default ListProposalVotes;
