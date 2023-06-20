import Button from "@components/UI/Button";
import { IconCaretDown, IconCaretUp, IconSpinner } from "@components/UI/Icons";
import Loader from "@components/UI/Loader";
import ProposalContent from "@components/_pages/ProposalContent";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { CONTEST_STATUS } from "@helpers/contestStatus";
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
import Link from "next/link";
import { useRouter } from "next/router";
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
  const { contestAuthorEthereumAddress, contestStatus, downvotingAllowed } = useContestStore(state => state);
  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserAvailableVotesAmount,
    didUserPassSnapshotAndCanVote,
    checkIfUserPassedSnapshotLoading,
    currentUserSubmitProposalTokensAmount,
    isLoading: isUserStoreLoading,
  } = useUserStore(state => state);

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

  // Contest not cancelled
  if (contestStatus !== CONTEST_STATUS.CANCELLED) {
    if (contestStatus === CONTEST_STATUS.SUBMISSIONS_NOT_OPEN) {
      return (
        <div className="flex flex-col text-center items-center">
          <p className="text-neutral-9 italic mb-6">Submissions aren&apos;t open yet.</p>
        </div>
      );
    }
    // Empty state
    if (!listProposalsIds.length) {
      return (
        <div className="flex flex-col text-center items-center">
          <p className="text-neutral-9 italic mb-6">
            {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
            currentUserSubmitProposalTokensAmount < amountOfTokensRequiredToSubmitEntry
              ? "You can't submit a proposal for this contest."
              : "It seems no one submitted a proposal for this contest."}
          </p>
          {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
            currentUserSubmitProposalTokensAmount >= amountOfTokensRequiredToSubmitEntry && (
              <Button onClick={() => setIsSubmitProposalModalOpen(true)}>Submit a proposal</Button>
            )}
        </div>
      );
    } else {
      if (isPageProposalsLoading && !Object.keys(listProposalsData)?.length) {
        return <Loader scale="component">Loading proposals...</Loader>;
      }
      return (
        <>
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
                  <div
                    className="flex flex-col w-full h-56 animate-appear rounded-[10px] border border-neutral-11"
                    key={id}
                  >
                    <ProposalContent content={listProposalsData[id].content} author={contestAuthorEthereumAddress} />
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
        </>
      );
    }
  }

  // Contest cancelled
  return (
    <div className="flex flex-col text-center items-center">
      <p className="text-neutral-9 italic mb-6">This contest was cancelled.</p>
    </div>
  );
};

export default ListProposals;
