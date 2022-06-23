import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { isAfter, isBefore, isDate } from "date-fns";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/solid";
import { CalendarIcon, ClipboardListIcon, DocumentDownloadIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST, ROUTE_VIEW_CONTEST_RULES } from "@config/routes";
import Button from "@components/Button";
import Loader from "@components/Loader";
import DialogModal from "@components/DialogModal";
import {
  useStore as useStoreContest,
  Provider as ProviderContest,
  createStore as createStoreContest,
} from "@hooks/useContest/store";
import {
  useStore as useStoreSubmitProposal,
  Provider as ProviderSubmitProposal,
  createStore as createStoreSubmitProposal,
} from "@hooks/useSubmitProposal/store";

import {
  useStore as useStoreCastVotes,
  Provider as ProviderCastVotes,
  createStore as createStoreCastVotes,
} from "@hooks/useCastVotes/store";

import { useContest } from "@hooks/useContest";
import { getLayout as getBaseLayout } from "./../LayoutBase";
import Timeline from "./Timeline";
import VotingToken from "./VotingToken";
import styles from "./styles.module.css";
import FormSearchContest from "@components/_pages/FormSearchContest";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import DialogModalVoteForProposal from "@components/_pages/DialogModalVoteForProposal";
import useContestEvents from "@hooks/useContestEvents";
import { chains } from "@config/wagmi";
import { CONTEST_STATUS } from "@helpers/contestStatus";

const LayoutViewContest = (props: any) => {
  const { children } = props;
  const { query, asPath, pathname, push } = useRouter();
  const { data } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();
  const { activeConnector } = useConnect();
  const {
    isLoading,
    address,
    fetchContestInfo,
    setIsLoading,
    setIsListProposalsLoading,
    isListProposalsLoading,
    isSuccess,
    isError,
    isListProposalsError,
    retry,
    onSearch,
    chainId,
    setChaindId,
  } = useContest();

  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserAvailableVotesAmount,
    listProposalsIds,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
    contestMaxProposalCount,
    submissionsOpen,
    votesOpen,
    votesClose,
    contestName,
    contestAuthor,
    contestStatus,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      contestName: state.contestName,
      //@ts-ignore
      contestAuthor: state.contestAuthor,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
      //@ts-ignore
      contestMaxProposalCount: state.contestMaxProposalCount,
      //@ts-ignore
      currentUserProposalCount: state.currentUserProposalCount,
      //@ts-ignore
      listProposalsIds: state.listProposalsIds,
      //@ts-ignore
      amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
    }),
    shallow,
  );

  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const stateSubmitProposal = useStoreSubmitProposal();
  const stateCastVotes = useStoreCastVotes();

  useContestEvents();

  useEffect(() => {
    if (activeChain?.id === chainId) {
      fetchContestInfo();
    } else {
      setIsLoading(false);
      setIsListProposalsLoading(false);
    }
  }, [activeChain?.id, chainId, asPath.split("/")[2], asPath.split("/")[3]]);

  useEffect(() => {
    const chainName = chains.filter(chain => chain.id === chainId)?.[0]?.name.toLowerCase();
    if (asPath.split("/")[2] !== chainName) {
      if (pathname === ROUTE_VIEW_CONTEST) {
        let newRoute = pathname
          .replace("[chain]", chainName)
          .replace("[address]", address)
          //@ts-ignore
          .replace("[proposal]", query?.proposal);
        push(pathname, newRoute, { shallow: true });
      }
    }
  }, [chainId, address]);

  useEffect(() => {
    if (activeConnector) {
      activeConnector.on("change", data => {
        //@ts-ignore
        setChaindId(data.chain.id);
      });
    }
  }, [activeConnector]);

  return (
    <>
      <div className="border-b border-solid border-neutral-2 py-2">
        <div className="container mx-auto">
          <FormSearchContest onSubmit={onSearch} isInline={true} />
        </div>
      </div>
      <div className="flex-grow container mx-auto relative md:grid md:gap-6  md:grid-cols-12">
        <div
          className={`${styles.navbar} ${styles.withFakeSeparator} z-10 justify-center md:justify-start md:pie-3 border-neutral-4 md:border-ie md:overflow-y-auto sticky inline-start-0 top-0 bg-true-black py-2 md:pt-0 md:mt-5 md:pb-10 md:h-full md:max-h-[calc(100vh-4rem)] md:col-span-4`}
        >
          <nav className={`${styles.navbar} md:space-y-1 `}>
            <Link
              href={{
                pathname: ROUTE_VIEW_CONTEST,
                //@ts-ignore
                query: {
                  chain: query.chain,
                  address: query.address,
                },
              }}
            >
              <a
                className={`${styles.navLink} ${
                  [ROUTE_VIEW_CONTEST, ROUTE_CONTEST_PROPOSAL].includes(pathname) ? styles["navLink--active"] : ""
                }`}
              >
                <HomeIcon className={styles.navLinkIcon} /> Contest
              </a>
            </Link>
            <Link
              href={{
                pathname: ROUTE_VIEW_CONTEST_RULES,
                //@ts-ignore
                query: {
                  chain: query.chain,
                  address: query.address,
                },
              }}
            >
              <a
                className={`${styles.navLink} ${
                  pathname === ROUTE_VIEW_CONTEST_RULES ? styles["navLink--active"] : ""
                }`}
              >
                <ClipboardListIcon className={styles.navLinkIcon} />
                Rules
              </a>
            </Link>
          </nav>

          <button
            disabled={isLoading || isError === null || activeChain?.id !== chainId}
            className={`md:mt-1 md:mb-3 ${
              isLoading || isError === null || activeChain?.id !== chainId ? "opacity-50 cursor-not-allowed" : ""
            } ${styles.navLink}`}
          >
            <DocumentDownloadIcon className={styles.navLinkIcon} />
            Export data
          </button>
          {!isLoading && contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN && (
            <>
              <Button
                /* @ts-ignore */
                onClick={() => stateSubmitProposal.setIsModalOpen(true)}
                className="animate-appear fixed md:static z-10  aspect-square 2xs:aspect-auto bottom-16 inline-end-5 md:bottom-unset md:inline-end-unset"
                intent={
                  currentUserAvailableVotesAmount < amountOfTokensRequiredToSubmitEntry ||
                  currentUserProposalCount === contestMaxNumberSubmissionsPerUser ||
                  contestMaxProposalCount === listProposalsIds.length
                    ? "primary-outline"
                    : "primary"
                }
                disabled={
                  isLoading ||
                  isListProposalsLoading ||
                  isListProposalsError !== null ||
                  isError !== null ||
                  activeChain?.id !== chainId ||
                  currentUserAvailableVotesAmount < amountOfTokensRequiredToSubmitEntry ||
                  currentUserProposalCount === contestMaxNumberSubmissionsPerUser ||
                  contestMaxProposalCount === listProposalsIds.length
                }
              >
                <PaperAirplaneIcon className="w-5 2xs:w-6 rotate-45 2xs:mie-0.5 -translate-y-0.5 md:hidden" />
                <span className="sr-only 2xs:not-sr-only">Submit</span>
              </Button>
            </>
          )}
          <Button
            onClick={() => setIsTimelineModalOpen(true)}
            disabled={
              isLoading ||
              isError !== null ||
              activeChain?.id !== chainId ||
              !isDate(submissionsOpen) ||
              !isDate(votesOpen) ||
              !isDate(votesClose)
            }
            intent="true-solid-outline"
            className={`
          ${
            !isDate(submissionsOpen) ||
            !isDate(votesOpen) ||
            !isAfter(new Date(), submissionsOpen) ||
            !isBefore(new Date(), votesOpen)
              ? "bottom-16"
              : "bottom-32"
          }
          animate-appear fixed md:static md:hidden z-10 aspect-square 2xs:aspect-auto 2xs:bottom-[7.5rem] inline-end-5 md:bottom-unset md:inline-end-unset`}
          >
            <CalendarIcon className="w-5 2xs:mie-1 md:hidden" />
            <span className="sr-only 2xs:not-sr-only">Timeline</span>
          </Button>
          {!isLoading &&
            isSuccess &&
            activeChain?.id === chainId &&
            isDate(submissionsOpen) &&
            isDate(votesOpen) &&
            isDate(votesClose) && (
              <>
                <div className="hidden md:my-4 md:block">
                  <VotingToken />
                </div>
                <div className="hidden md:block">
                  <Timeline />
                </div>
              </>
            )}
        </div>
        <div className="md:pt-5 flex flex-col md:col-span-8">
          {!data?.address ? (
            <p className="animate-appear font-bold text-center text-lg pt-10">
              Please connect your account to view this contest.
            </p>
          ) : (
            <>
              {activeChain?.id !== chainId && (
                <div className="animate-appear flex text-center flex-col mt-10 mx-auto">
                  <p className="font-bold text-lg">Looks like you&apos;re using the wrong network.</p>
                  <p className="mt-2 mb-4 text-neutral-11 text-xs">
                    You need to use {asPath.split("/")[2]} to check this contest.
                  </p>
                  <Button
                    onClick={() => {
                      switchNetwork?.(chainId);
                    }}
                    className="mx-auto"
                  >
                    Switch network
                  </Button>
                </div>
              )}
              {activeChain?.id === chainId && (isLoading || isListProposalsLoading) && (
                <div className="animate-appear">
                  <Loader scale="page" />
                </div>
              )}

              {activeChain?.id === chainId && isError !== null && !isLoading && (
                <div className="my-6 md:my-0 animate-appear flex flex-col">
                  <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
                    <p className="text-sm font-bold text-negative-10 text-center">
                      Something went wrong while fetching this contest.
                    </p>
                  </div>
                  {isError === "CALL_EXCEPTION" ? (
                    <div className="animate-appear text-center my-3 space-y-3">
                      <p>
                        Looks like this contract doesn&apos;t exist on {activeChain.name}. <br /> Try switching to
                        another network.
                      </p>
                    </div>
                  ) : (
                    <Button
                      /* @ts-ignore */
                      onClick={() => retry()}
                      className="mt-5 mb-8 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
                      intent="neutral-outline"
                    >
                      Try again
                    </Button>
                  )}
                </div>
              )}

              {activeChain?.id === chainId && isSuccess && isError === null && !isLoading && (
                <div className="animate-appear pt-3 md:pt-0">
                  {pathname === ROUTE_CONTEST_PROPOSAL && (
                    <div>
                      <Link
                        href={{
                          pathname: ROUTE_VIEW_CONTEST,
                          //@ts-ignore
                          query: {
                            chain: query.chain,
                            address: query.address,
                          },
                        }}
                      >
                        <a className="text-neutral-12 hover:text-opacity-75 focus:underline flex items-center mb-2 text-2xs">
                          <ArrowLeftIcon className="mie-1 w-4" />
                          Back to contest
                        </a>
                      </Link>
                    </div>
                  )}
                  <h2 className="flex flex-wrap items-baseline text-neutral-11 font-bold mb-6">
                    <span className="uppercase tracking-wide pie-1ex">{contestName}</span>{" "}
                    <span className="text-xs overflow-hidden text-neutral-8 text-ellipsis">by {contestAuthor}</span>
                  </h2>
                  {children}

                  <DialogModal isOpen={isTimelineModalOpen} setIsOpen={setIsTimelineModalOpen} title="Contest timeline">
                    {!isLoading &&
                      isSuccess &&
                      activeChain?.id === chainId &&
                      isDate(submissionsOpen) &&
                      isDate(votesOpen) &&
                      isDate(votesClose) && (
                        <>
                          <h3 className="text-lg text-neutral-12 mb-3 font-black">{contestName} - timeline</h3>
                          <div className="mb-2">
                            <VotingToken />
                          </div>
                          <Timeline />
                        </>
                      )}
                  </DialogModal>
                  {!isLoading &&
                    isSuccess &&
                    activeChain?.id === chainId &&
                    isDate(submissionsOpen) &&
                    isAfter(new Date(), submissionsOpen) &&
                    isDate(votesOpen) &&
                    isBefore(new Date(), votesOpen) && (
                      <DialogModalSendProposal
                        /* @ts-ignore */
                        isOpen={stateSubmitProposal.isModalOpen}
                        /* @ts-ignore */
                        setIsOpen={stateSubmitProposal.setIsModalOpen}
                      />
                    )}

                  {!isLoading &&
                    isSuccess &&
                    activeChain?.id === chainId &&
                    isDate(votesOpen) &&
                    isAfter(new Date(), votesOpen) &&
                    isDate(votesClose) &&
                    isBefore(new Date(), votesClose) && (
                      <DialogModalVoteForProposal
                        /* @ts-ignore */
                        isOpen={stateCastVotes.isModalOpen}
                        /* @ts-ignore */
                        setIsOpen={stateCastVotes.setIsModalOpen}
                      />
                    )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(
    <ProviderContest createStore={createStoreContest}>
      <ProviderSubmitProposal createStore={createStoreSubmitProposal}>
        <ProviderCastVotes createStore={createStoreCastVotes}>
          <LayoutViewContest>{page}</LayoutViewContest>
        </ProviderCastVotes>
      </ProviderSubmitProposal>
    </ProviderContest>,
  );
};
