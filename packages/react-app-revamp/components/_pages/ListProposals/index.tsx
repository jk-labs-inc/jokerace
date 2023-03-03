import Button from "@components/Button";
import { IconCaretDown, IconCaretUp, IconSpinner } from "@components/Icons";
import Loader from "@components/Loader";
import ProposalContent from "@components/_pages/ProposalContent";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import isProposalDeleted from "@helpers/isProposalDeleted";
import truncate from "@helpers/truncate";
import { TrashIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContest } from "@hooks/useContest";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useDeleteProposalStore } from "@hooks/useDeleteProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
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
  const {
    contestAuthorEthereumAddress,
    amountOfTokensRequiredToSubmitEntry,
    listProposalsData,
    currentUserAvailableVotesAmount,
    contestStatus,
    didUserPassSnapshotAndCanVote,
    checkIfUserPassedSnapshotLoading,
    downvotingAllowed,
    listProposalsIds,
    currentUserSubmitProposalTokensAmount,
    isPageProposalsLoading,
    isPageProposalsError,
    currentPagePaginationProposals,
    indexPaginationProposals,
    totalPagesPaginationProposals,
  } = useStoreContest(state => ({
    //@ts-ignore
    currentPagePaginationProposals: state.currentPagePaginationProposals,
    //@ts-ignore
    isPageProposalsLoading: state.isPageProposalsLoading,
    //@ts-ignore
    isPageProposalsError: state.isPageProposalsError,
    //@ts-ignore
    downvotingAllowed: state.downvotingAllowed,
    //@ts-ignore
    listProposalsIds: state.listProposalsIds,
    //@ts-ignore
    contestAuthorEthereumAddress: state.contestAuthorEthereumAddress,
    //@ts-ignore
    contestStatus: state.contestStatus,
    //@ts-ignore
    listProposalsData: state.listProposalsData,
    //@ts-ignore
    currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
    //@ts-ignore
    amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    didUserPassSnapshotAndCanVote: state.didUserPassSnapshotAndCanVote,
    //@ts-ignore
    checkIfUserPassedSnapshotLoading: state.checkIfUserPassedSnapshotLoading,
    //@ts-ignore
    indexPaginationProposals: state.indexPaginationProposals,
    //@ts-ignore,
    totalPagesPaginationProposals: state.totalPagesPaginationProposals,
    //@ts-ignore
    currentUserSubmitProposalTokensAmount: state.currentUserSubmitProposalTokensAmount,
    //@ts-ignore
    indexPaginationProposals: state.indexPaginationProposals,
    //@ts-ignore,
    totalPagesPaginationProposals: state.totalPagesPaginationProposals,
  }));
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

  const { fetchProposalsPage } = useContest();
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
          <ul className={`${styles.list} space-y-12`}>
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
                  <li
                    className={`${styles.listElement} animate-appear px-5 pt-5 pb-3 rounded-md 2xs:rounded-none 2xs:p-0 border border-solid border-neutral-1 2xs:border-0 relative overflow-hidden text-sm ${styles.wrapper}`}
                    key={id}
                  >
                    <div className="text-center 2xs:border-is-4 border-solid border-neutral-1 2xs:border-neutral-5 flex flex-col 2xs:items-center pt-2 2xs:pt-0">
                      {!isProposalDeleted(listProposalsData[id].content) &&
                        contestAuthorEthereumAddress === accountData?.address && (
                          <button
                            disabled={network?.chain?.name?.toLowerCase()?.replace(" ", "") !== chain ? true : false}
                            onClick={() => onClickProposalDelete(id)}
                            className="hidden 2xs:flex mb-6 mx-2 2xs:text-2xs rounded-md 2xs:p-2.5 relative z-20 text-negative-12 hover:bg-negative-4 hover:bg-opacity-50 focus:bg-negative-2 focus:border-negative-8 border-negative-6 border border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Delete this proposal</span>
                            <TrashIcon className="w-4" />
                          </button>
                        )}
                      {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN ? (
                        <span className="text-3xs text-neutral-11 italic">Vote not open yet</span>
                      ) : (
                        <>
                          {listProposalsData[id].votes > 0 && (
                            <span
                              className={`${styles.rankIndicator} hidden 2xs:flex rounded-full items-center justify-center aspect-square text-opacity-100 mb-3`}
                            >
                              #{i + 1}
                            </span>
                          )}
                          <div className=" text-neutral-12 flex space-y-2 flex-col items-center justify-center font-bold text-2xs">
                            {(contestStatus === CONTEST_STATUS.VOTING_OPEN && checkIfUserPassedSnapshotLoading) ||
                              (contestStatus === CONTEST_STATUS.SNAPSHOT_ONGOING && (
                                <IconSpinner className="text-sm animate-spin mie-2 2xs:mie-0 2xs:mb-1" />
                              ))}
                            {!isProposalDeleted(listProposalsData[id].content) &&
                              didUserPassSnapshotAndCanVote &&
                              contestStatus === CONTEST_STATUS.VOTING_OPEN &&
                              currentUserAvailableVotesAmount > 0 && (
                                <button
                                  onClick={() => onClickUpVote(id)}
                                  disabled={
                                    checkIfUserPassedSnapshotLoading ||
                                    !didUserPassSnapshotAndCanVote ||
                                    contestStatus !== CONTEST_STATUS.VOTING_OPEN ||
                                    currentUserAvailableVotesAmount === 0
                                  }
                                  className="w-full 2xs:w-auto disabled:text-opacity-50 disabled:cursor-not-allowed disabled:border-none border border-solid border-neutral-5 rounded-md p-2 2xs:p-1.5 flex items-center justify-center"
                                >
                                  <IconCaretUp className="text-2xs mie-2 2xs:mie-0" />
                                  <span className="2xs:sr-only">Up vote</span>
                                </button>
                              )}
                            <span className="flex 2xs:flex-col">
                              {Intl.NumberFormat("en-US", {
                                notation: "compact",
                                maximumFractionDigits: 3,
                              }).format(parseFloat(listProposalsData[id].votes))}{" "}
                              <span className="text-neutral-11 pis-1ex 2xs:pis-0 text-3xs">
                                vote
                                {(listProposalsData[id].votes > 1 ||
                                  listProposalsData[id].votes < -1 ||
                                  listProposalsData[id].votes === 0) &&
                                  "s"}
                              </span>
                            </span>
                            {!isProposalDeleted(listProposalsData[id].content) &&
                              didUserPassSnapshotAndCanVote &&
                              contestStatus === CONTEST_STATUS.VOTING_OPEN &&
                              currentUserAvailableVotesAmount > 0 &&
                              downvotingAllowed && (
                                <button
                                  onClick={() => onClickDownVote(id)}
                                  disabled={
                                    checkIfUserPassedSnapshotLoading ||
                                    !didUserPassSnapshotAndCanVote ||
                                    contestStatus !== CONTEST_STATUS.VOTING_OPEN ||
                                    currentUserAvailableVotesAmount === 0
                                  }
                                  className="w-full 2xs:w-auto disabled:text-opacity-50 disabled:cursor-not-allowed disabled:border-none border border-solid border-neutral-5 rounded-md p-2 2xs:p-1.5 flex items-center justify-center"
                                >
                                  <IconCaretDown className="text-2xs mie-2 2xs:mie-0" />
                                  <span className="2xs:sr-only">Down vote</span>
                                </button>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative overflow-hidden">
                      {listProposalsData[id].votes > 0 && (
                        <span
                          className={`${styles.rankIndicator} inline-flex 2xs:hidden rounded-full items-center justify-center aspect-square text-opacity-100 mb-3`}
                        >
                          #{i + 1}
                        </span>
                      )}
                      <ProposalContent
                        author={listProposalsData[id].authorEthereumAddress}
                        content={
                          listProposalsData[id].isContentImage
                            ? listProposalsData[id].content
                            : truncate(listProposalsData[id].content, 280)
                        }
                      />

                      <Link
                        href={{
                          pathname: ROUTE_CONTEST_PROPOSAL,
                          //@ts-ignore
                          query: {
                            chain,
                            address,
                            proposal: id,
                          },
                        }}
                      >
                        <a title={`View proposal #${id}`} className="absolute opacity-0 inset-0 w-full h-full z-10 ">
                          View proposal #{id}
                        </a>
                      </Link>
                      <div className="flex flex-col space-y-8 mt-6">
                        {listProposalsData[id].content.length > 280 && (
                          <Button
                            className="uppercase 2xs:!px-0 2xs:w-fit-content tracking-widest"
                            scale="xs"
                            intent="ghost-primary"
                            type="button"
                          >
                            Read full proposal
                          </Button>
                        )}

                        {!isProposalDeleted(listProposalsData[id].content) &&
                          contestAuthorEthereumAddress === accountData?.address && (
                            <button
                              disabled={network?.chain?.name?.toLowerCase()?.replace(" ", "") !== chain ? true : false}
                              onClick={() => onClickProposalDelete(id)}
                              className="flex items-center space-i-2 justify-center 2xs:hidden text-xs rounded-md py-1.5 px-3 relative z-20 text-negative-12 hover:bg-negative-4 hover:bg-opacity-50 focus:bg-negative-2 focus:border-negative-8 border-negative-6 border border-solid disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <TrashIcon className="w-4" />
                              <span className="font-bold">Delete this proposal</span>
                            </button>
                          )}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
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
