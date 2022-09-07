import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";
import { isAfter, isBefore, isDate } from "date-fns";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import {
  ROUTE_CONTEST_PROPOSAL,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTEST_EXPORT_DATA,
  ROUTE_VIEW_CONTEST_RULES,
} from "@config/routes";
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

import {
  useStore as useStoreDeleteProposal,
  Provider as ProviderDeleteProposal,
  createStore as createStoreDeleteProposal,
} from "@hooks/useDeleteProposal/store";

import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
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
import Sidebar from "./Sidebar";
import useCheckSnapshotProgress from "./Timeline/Countdown/useCheckSnapshotProgress";
import DialogModalDeleteProposal from "@components/_pages/DialogModalDeleteProposal";
import { switchNetwork } from "@wagmi/core";
import { ErrorBoundary } from "react-error-boundary";

const LayoutViewContest = (props: any) => {
  const { children } = props;
  const { query, asPath, pathname, push } = useRouter();
  const account = useAccount();
  const { chain } = useNetwork();

  const {
    isLoading,
    address,
    fetchContestInfo,
    checkIfCurrentUserQualifyToVote,
    isListProposalsLoading,
    isSuccess,
    isError,
    isListProposalsError,
    retry,
    onSearch,
    chainId,
    setChainId,
  } = useContest();

  const {
    didUserPassSnapshotAndCanVote,
    snapshotTaken,
    checkIfUserPassedSnapshotLoading,
    submissionsOpen,
    votesOpen,
    votesClose,
    contestName,
    contestAuthor,
    contestPrompt,
    contestStatus,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      contestName: state.contestName,
      //@ts-ignore
      contestPrompt: state.contestPrompt,
      //@ts-ignore
      contestAuthor: state.contestAuthor,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore
      snapshotTaken: state.snapshotTaken,
      //@ts-ignore
      checkIfUserPassedSnapshotLoading: state.checkIfUserPassedSnapshotLoading,
      //@ts-ignore
      didUserPassSnapshotAndCanVote: state.didUserPassSnapshotAndCanVote,
    }),
    shallow,
  );
  const { updateSnapshotProgress } = useCheckSnapshotProgress();
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const stateSubmitProposal = useStoreSubmitProposal();
  const stateCastVotes = useStoreCastVotes();
  const stateDeleteProposasl = useStoreDeleteProposal();

  useContestEvents();
  useEffect(() => {
      fetchContestInfo();
  }, [chain?.id, chainId, asPath.split("/")[2], asPath.split("/")[3]]);

  useEffect(() => {
    const chainName = chains
      .filter(chain => chain.id === chainId)?.[0]
      ?.name.toLowerCase()
      .replace(" ", "");
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
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data.chain.id);
      });
    }
  }, [account?.connector]);

  useEffect(() => {
    const verifySnapshot = async () => {
      await checkIfCurrentUserQualifyToVote();
    };

    if (contestStatus === CONTEST_STATUS.SNAPSHOT_ONGOING) updateSnapshotProgress();
    if ([CONTEST_STATUS.VOTING_OPEN, CONTEST_STATUS.COMPLETED].includes(contestStatus)) {
      verifySnapshot();
    }
  }, [contestStatus]);

  return (
    <>
      <div className={`${isLoading ? "pointer-events-none" : ""} border-b border-solid border-neutral-2 py-2`}>
        <div className="container mx-auto">
          <FormSearchContest onSubmit={onSearch} retry={retry} isInline={true} />
        </div>
      </div>
      <div
        className={`${
          isLoading ? "pointer-events-none" : ""
        } flex-grow container mx-auto md:grid md:gap-6 md:grid-cols-12 md:-mb-20`}
      >
        <div
          className={`md:max-h-[calc(100vh-8rem)] ${styles.navbar} ${styles.withFakeSeparator} z-10 justify-center md:justify-start md:pie-3 border-neutral-4 md:border-ie md:overflow-y-auto sticky inline-start-0 top-0 md:top-1 bg-true-black py-2 md:pt-0 md:mt-5 md:pb-10 md:h-full md:col-span-4`}
        >
          <Sidebar
            isLoading={isLoading}
            isListProposalsLoading={isListProposalsLoading}
            isSuccess={isSuccess}
            isError={isError}
            isListProposalsError={isListProposalsError}
            chainId={chainId}
            setIsTimelineModalOpen={setIsTimelineModalOpen}
          />
        </div>
        <div className="md:pt-5 md:pb-20 flex flex-col md:col-span-8">
          {
            ((isLoading || isListProposalsLoading) && (
              <div className="animate-appear">
                <Loader scale="page" />
              </div>
            ))}

              {account?.address && chain?.id !== chainId && (
                <div className="animate-appear flex text-center flex-col mt-10 mx-auto">
                  <p className="font-bold text-lg">Looks like you&apos;re using the wrong network.</p>
                  <p className="mt-2 mb-4 text-neutral-11 text-xs">
                    You need to use {asPath.split("/")[2]} to check this contest.
                  </p>
                  <Button
                    onClick={() => {
                      switchNetwork?.({chainId});
                    }}
                    className="mx-auto"
                  >
                    Switch network
                  </Button>
                </div>
              )}

          {
            <>

              {((account?.address && chain?.id !== chainId) === false)  && isError !== null && !isLoading && (
                <div className="my-6 md:my-0 animate-appear flex flex-col">
                  <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
                    <p className="text-sm font-bold text-negative-10 text-center">
                      Something went wrong while fetching this contest.
                    </p>
                  </div>
                  {isError === "CALL_EXCEPTION" ? (
                    <div className="animate-appear text-center my-3 space-y-3">
                      <p>
                        Looks like this contract doesn&apos;t exist on {chain?.name}. <br /> Try switching to another
                        network.
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

              {isSuccess && isError === null && !isLoading && (
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
                  <h2
                    className={`flex flex-wrap items-baseline text-neutral-11 font-bold ${
                      contestPrompt ? "mb-3" : "mb-6"
                    }`}
                  >
                    <span className="uppercase tracking-wide pie-1ex">{contestName}</span>{" "}
                    <span className="text-xs overflow-hidden text-neutral-8 text-ellipsis">by {contestAuthor}</span>
                  </h2>

                  {contestPrompt && (
                    <p className="text-sm with-link-highlighted font-bold pb-8 border-b border-neutral-4">
                      <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} />
                    </p>
                  )}

                  {contestStatus === CONTEST_STATUS.SNAPSHOT_ONGOING && (
                    <div className="mt-4 animate-appear p-3 rounded-md border-solid border border-neutral-4 mb-5 text-sm font-bold">
                      <p>Snapshot ongoing, voting will be open in 30sec-1min, please wait... </p>
                    </div>
                  )}

                  {snapshotTaken &&
                    !checkIfUserPassedSnapshotLoading &&
                    !didUserPassSnapshotAndCanVote &&
                    contestStatus === CONTEST_STATUS.VOTING_OPEN &&
                    ![ROUTE_VIEW_CONTEST_RULES, ROUTE_VIEW_CONTEST_EXPORT_DATA].includes(pathname) && (
                      <section className="animate-appear">
                        <p className="mt-4 p-3 rounded-md border-solid border mb-5 text-sm font-bold bg-primary-1 text-primary-10 border-primary-4">
                          Too bad, your wallet didn&apos;t qualify to vote.
                        </p>
                      </section>
                    )}

                  {children}

                  <DialogModal isOpen={isTimelineModalOpen} setIsOpen={setIsTimelineModalOpen} title="Contest timeline">
                    {!isLoading &&
                      isSuccess &&
                      chain?.id === chainId &&
                      isDate(submissionsOpen) &&
                      isDate(votesOpen) &&
                      isDate(votesClose) && (
                        <>
                          <h3 className="text-lg text-neutral-12 mb-3 font-black">{contestName} - timeline</h3>
                          <div className="mb-4">
                            <VotingToken />
                          </div>
                          <Timeline />
                        </>
                      )}
                  </DialogModal>
                  {!isLoading &&
                    isSuccess &&
                    chain?.id === chainId &&
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
                    chain?.id === chainId &&
                    <DialogModalDeleteProposal
                      /* @ts-ignore */
                      isOpen={stateDeleteProposasl.isModalOpen}
                      /* @ts-ignore */
                      setIsOpen={stateDeleteProposasl.setIsModalOpen}
                    />
                  }
                  {!isLoading &&
                    isSuccess &&
                    chain?.id === chainId &&
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
          }
        </div>
      </div>
    </>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(
    <ErrorBoundary
    fallbackRender={({error, resetErrorBoundary}) => (
      <div role="alert" className="container m-auto sm:text-center">
        <p className='text-2xl font-black mb-3 text-primary-10'>Something went wrong</p>
        {/*  eslint-disable-next-line react/no-unescaped-entities */}
        <p className='text-neutral-12 mb-6'>
          {error?.message ?? error}
        </p>
        <Button onClick={resetErrorBoundary}>
          Try again
        </Button>
      </div>
    )}
  >
    <ProviderContest createStore={createStoreContest}>
      <ProviderSubmitProposal createStore={createStoreSubmitProposal}>
        <ProviderCastVotes createStore={createStoreCastVotes}>
          <ProviderDeleteProposal createStore={createStoreDeleteProposal}>
            <LayoutViewContest>{page}</LayoutViewContest>
          </ProviderDeleteProposal>
        </ProviderCastVotes>
      </ProviderSubmitProposal>
    </ProviderContest>
    </ErrorBoundary>,
  );
};
