import Button from "@components/UI/Button";
import { IconCaretDown, IconCaretUp, IconSpinner } from "@components/UI/Icons";
import Loader from "@components/UI/Loader";
import ProposalContent from "@components/_pages/ProposalContent";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import isProposalDeleted from "@helpers/isProposalDeleted";
import truncate from "@helpers/truncate";
import { TrashIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { useDeleteProposalStore } from "@hooks/useDeleteProposal/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { Interweave } from "interweave";
import moment from "moment";
import { now } from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import styles from "./styles.module.css";

export const ListProposals = () => {
  const {
    query: { chain, address },
  } = useRouter();
  const accountData = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const network = useNetwork();
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
  const { contestAuthorEthereumAddress, downvotingAllowed, votesOpen, votesClose, submissionsOpen } = useContestStore(
    state => state,
  );
  const { currentUserAvailableVotesAmount, isLoading: isUserStoreLoading } = useUserStore(state => state);

  const now = moment();
  const formattedVotingOpen = moment(votesOpen);
  const { setIsSubmitProposalModalOpen } = useSubmitProposalStore(state => ({
    setIsSubmitProposalModalOpen: state.setIsModalOpen,
  }));
  const { setCastPositiveAmountOfVotes, setPickedProposalToVoteFor, setIsModalCastVotesOpen } = useCastVotesStore(
    state => ({
      setPickedProposalToVoteFor: state.setPickedProposal,
      setIsModalCastVotesOpen: state.setIsModalOpen,
      setCastPositiveAmountOfVotes: state.setCastPositiveAmountOfVotes,
    }),
  );

  const { setPickedProposalToDelete, setIsModalDeleteProposalOpen } = useDeleteProposalStore(state => ({
    setPickedProposalToDelete: state.setPickedProposal,
    setIsModalDeleteProposalOpen: state.setIsModalOpen,
  }));

  function onClickUpVote(proposalId: number | string) {
    setCastPositiveAmountOfVotes(true);
    setPickedProposalToVoteFor(proposalId.toString());
    setIsModalCastVotesOpen(true);
  }

  function onClickDownVote(proposalId: number | string) {
    setCastPositiveAmountOfVotes(false);
    setPickedProposalToVoteFor(proposalId.toString());
    setIsModalCastVotesOpen(true);
  }

  function onClickProposalDelete(proposalId: number | string) {
    setPickedProposalToDelete(proposalId);
    setIsModalDeleteProposalOpen(true);
  }

  if (isPageProposalsLoading && !Object.keys(listProposalsData)?.length) {
    return <Loader scale="component">Loading proposals...</Loader>;
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {Object.keys(listProposalsData)
          .sort((a, b) => {
            if (listProposalsData[a].votes > listProposalsData[b].votes) {
              return -1;
            }
            if (listProposalsData[a].votes < listProposalsData[b].votes) {
              return 1;
            }
            return 0;
          })
          .map((id, i) => {
            return (
              <div key={id} className="relative">
                {!now.isBefore(formattedVotingOpen) && (
                  <div
                    className="absolute -top-0 left-0 -mt-6 -ml-6  w-12 z-10
                     h-12 rounded-full bg-true-black flex items-center justify-center text-[24px] font-bold text-neutral-11 border border-neutral-11"
                  >
                    {i + 1}
                  </div>
                )}

                <ProposalContent
                  proposal={listProposalsData[id]}
                  submissionOpen={submissionsOpen}
                  votingOpen={votesOpen}
                  votingClose={votesClose}
                />
              </div>
            );
          })}
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
