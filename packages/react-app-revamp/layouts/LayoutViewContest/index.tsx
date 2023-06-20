import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
import Loader from "@components/UI/Loader";
import {
  ROUTE_CONTEST_PROPOSAL,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTEST_EXPORT_DATA,
  ROUTE_VIEW_CONTEST_RULES,
} from "@config/routes";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { ContestWrapper, useContestStore } from "@hooks/useContest/store";
import { ProposalWrapper, useProposalStore } from "@hooks/useProposal/store";
import { UserWrapper, useUserStore } from "@hooks/useUser/store";

import { SubmitProposalWrapper, useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { isAfter, isBefore, isDate } from "date-fns";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { CastVotesWrapper, useCastVotesStore } from "@hooks/useCastVotes/store";

import { DeleteProposalWrapper, useDeleteProposalStore } from "@hooks/useDeleteProposal/store";

import DialogModalDeleteProposal from "@components/_pages/DialogModalDeleteProposal";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import DialogModalVoteForProposal from "@components/_pages/DialogModalVoteForProposal";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import { RefreshIcon } from "@heroicons/react/outline";
import { useContest } from "@hooks/useContest";
import useContestEvents from "@hooks/useContestEvents";
import useUser from "@hooks/useUser";
import { switchNetwork } from "@wagmi/core";
import { ErrorBoundary } from "react-error-boundary";
import { getLayout as getBaseLayout } from "./../LayoutBase";
import ContestLayoutTabs from "./Tabs";
import Timeline from "./Timeline";
import useCheckSnapshotProgress from "./Timeline/Countdown/useCheckSnapshotProgress";
import VotingToken from "./VotingToken";
import LayoutContestTimeline from "./TimelineV3";
import LayoutContestCountdown from "./StickyCards/components/Countdown";
import LayoutContestPrompt from "./Prompt";
import moment from "moment";

const LayoutViewContest = (props: any) => {
  const { children } = props;
  const { query, asPath, pathname, push, reload } = useRouter();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chain } = useNetwork();

  const { checkIfCurrentUserQualifyToVote, checkCurrentUserAmountOfProposalTokens } = useUser();

  const { isLoading, address, fetchContestInfo, isSuccess, error, retry, onSearch, chainId, chainName, setChainId } =
    useContest();

  const {
    snapshotTaken,
    submissionsOpen,
    votesClose,
    votesOpen,
    contestAuthor,
    contestStatus,
    contestPrompt,
    contestName,
    contestMaxProposalCount,
  } = useContestStore(state => state);
  const contestInProgress = moment().isBefore(votesClose);
  const { didUserPassSnapshotAndCanVote, checkIfUserPassedSnapshotLoading } = useUserStore(state => state);

  const { updateSnapshotProgress } = useCheckSnapshotProgress();
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const { isListProposalsLoading, isListProposalsError, listProposalsIds } = useProposalStore(state => state);

  const { isSubmitProposalModalOpen, setIsSubmitProposalModalOpen } = useSubmitProposalStore(state => ({
    isSubmitProposalModalOpen: state.isModalOpen,
    setIsSubmitProposalModalOpen: state.setIsModalOpen,
  }));
  const { isCastVotesModalOpen, setIsCastVotesModalOpen } = useCastVotesStore(state => ({
    isCastVotesModalOpen: state.isModalOpen,
    setIsCastVotesModalOpen: state.setIsModalOpen,
  }));
  const { isDeleteProposalModalOpen, setIsDeleteProposalModalOpen } = useDeleteProposalStore(state => ({
    isDeleteProposalModalOpen: state.isModalOpen,
    setIsDeleteProposalModalOpen: state.setIsModalOpen,
  }));
  const { displayReloadBanner } = useContestEvents();

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
          //@ts-ignorecontestMaxProposalCount
          .replace("[proposal]", query?.proposal);
        push(pathname, newRoute, { shallow: true });
      }
    }
  }, [chainId, address]);

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data?.chain?.id);
      });
    }
  }, [account?.connector]);

  useEffect(() => {
    const verifySnapshot = async () => {
      if (account?.address) await checkIfCurrentUserQualifyToVote();
    };

    if (contestStatus === CONTEST_STATUS.SNAPSHOT_ONGOING) updateSnapshotProgress();
    if ([CONTEST_STATUS.VOTING_OPEN, CONTEST_STATUS.COMPLETED].includes(contestStatus)) {
      verifySnapshot();
    }
  }, [contestStatus, account?.address]);

  useEffect(() => {
    if (isListProposalsLoading && account?.address) {
      checkCurrentUserAmountOfProposalTokens();
      checkIfCurrentUserQualifyToVote();
    }
  }, [chainId, account?.address, isListProposalsLoading]);

  const onSubmitTitle = (title: string) => {
    router.push(`/contests?title=${title}`);
  };

  return (
    <>
      <div className={`${isLoading ? "pointer-events-none" : ""} w-[700px] mx-auto`}>
        {!isLoading &&
          isSuccess &&
          submissionsOpen &&
          votesOpen &&
          votesClose &&
          [CONTEST_STATUS.SUBMISSIONS_OPEN, CONTEST_STATUS.VOTING_OPEN].includes(contestStatus) && (
            <div
              className={`animate-appear text-center text-xs sticky bg-neutral-0 border-b border-neutral-4 border-solid ${
                pathname === ROUTE_CONTEST_PROPOSAL ? "top-0" : "top-10"
              } z-10 font-bold -mx-5 px-5 md:hidden w-screen py-1`}
            >
              <p className="text-center">
                {!isLoading && isSuccess && isDate(submissionsOpen) && isDate(votesOpen) && isDate(votesClose) && (
                  <>
                    {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN && (
                      <>
                        {listProposalsIds.length >= contestMaxProposalCount
                          ? "✋ Submissions closed ✋"
                          : "✨ Submissions open ✨"}
                      </>
                    )}
                    {contestStatus === CONTEST_STATUS.VOTING_OPEN && <>✨ Voting open ✨</>}
                  </>
                )}
              </p>
            </div>
          )}

        <div
          className={`md:pt-5 md:pb-20 flex flex-col ${
            pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
          }`}
        >
          {(isLoading || isListProposalsLoading) && (
            <div className="animate-appear">
              <Loader scale="page">Loading contest info...</Loader>
            </div>
          )}

          {account?.address && chain?.id !== chainId && votesClose && isBefore(new Date(), votesClose) && (
            <div className="animate-appear flex text-center flex-col my-10 mx-auto">
              <p className="font-bold text-lg">Looks like you&apos;re using the wrong network.</p>
              <p className="mt-2 mb-4 text-neutral-11 text-xs">
                You need to use {asPath.split("/")[2]} to interact with this contest.
              </p>
              <Button
                onClick={() => {
                  switchNetwork?.({ chainId });
                }}
                className="mx-auto"
              >
                Switch network
              </Button>
            </div>
          )}

          {
            <>
              {(account?.address && chain?.id !== chainId) === false && error && !isLoading && (
                <div className="my-6 md:my-0 animate-appear flex flex-col">
                  <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
                    <p className="text-sm font-bold text-negative-10 text-center">
                      Something went wrong while fetching this contest.
                    </p>
                  </div>
                  {error?.message === "CALL_EXCEPTION" ? (
                    <div className="animate-appear text-center my-3 space-y-3">
                      <p>
                        Looks like this contract doesn&apos;t exist on {chain?.name}. <br /> Try switching to another
                        network.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => retry()}
                      className="mt-5 mb-8 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
                      intent="neutral-outline"
                    >
                      Try again
                    </Button>
                  )}
                </div>
              )}

              {isSuccess && !error && !isLoading && (
                <>
                  {displayReloadBanner === true && (
                    <div className="mt-4 animate-appear p-3 rounded-md border-solid border border-neutral-4 mb-5 flex flex-col gap-y-3 text-sm font-bold">
                      <div className="flex gap-1.5 flex-col">
                        <span>Let&apos;s refresh!</span>
                        <p className="font-normal">Looks like live updates were frozen.</p>
                      </div>
                      <Button
                        className="w-full 2xs:w-fit-content"
                        intent="primary-outline"
                        scale="xs"
                        onClick={() => reload()}
                      >
                        <RefreshIcon className="mie-1ex w-4" />
                        Refresh
                      </Button>
                    </div>
                  )}
                  <div className="animate-appear pt-3 md:pt-0">
                    {pathname === ROUTE_CONTEST_PROPOSAL && (
                      <div>
                        <Link
                          className="text-neutral-12 hover:text-opacity-75 focus:underline flex items-center mb-2 text-2xs"
                          href={{
                            pathname: ROUTE_VIEW_CONTEST,
                            query: {
                              chain: query.chain,
                              address: query.address,
                            },
                          }}
                        >
                          <ArrowLeftIcon className="mie-1 w-4" />
                          Back to contest
                        </Link>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-10">
                      <p className="text-[40px] text-primary-10 font-sabo">{contestName}</p>
                      <p className="text-[24px] text-primary-10 font-bold">by {contestAuthor}</p>
                    </div>

                    <div className="mt-4 gap-3 flex flex-col">
                      <hr className="border-neutral-10" />
                      <ContestLayoutTabs contestAddress={address} chain={chain?.name ?? ""} contestName={contestName} />
                      <hr className="border-neutral-10" />
                    </div>

                    <div className="mt-4">
                      <LayoutContestTimeline
                        submissionOpenDate={submissionsOpen}
                        votingOpensDate={votesOpen}
                        contestCloseDate={votesClose}
                      />
                    </div>

                    {contestInProgress && (
                      <div className="mt-8 flex gap-4 sticky top-32 z-10">
                        <LayoutContestCountdown
                          submissionOpen={submissionsOpen}
                          votingOpen={votesOpen}
                          votingClose={votesClose}
                        />
                        <LayoutContestCountdown
                          submissionOpen={submissionsOpen}
                          votingOpen={votesOpen}
                          votingClose={votesClose}
                        />
                      </div>
                    )}

                    <div className="mt-8">
                      <LayoutContestPrompt prompt={contestPrompt} />
                    </div>

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

                    <DialogModal
                      isOpen={isTimelineModalOpen}
                      setIsOpen={setIsTimelineModalOpen}
                      title="Contest timeline"
                    >
                      {!isLoading && isSuccess && submissionsOpen && votesOpen && votesClose && (
                        <>
                          <h3 className="text-lg text-neutral-12 mb-3 font-black">{contestName} - timeline</h3>
                          {account?.address && (
                            <div className="mb-4">
                              <VotingToken />
                            </div>
                          )}
                          <Timeline />
                        </>
                      )}
                    </DialogModal>
                    {!isLoading &&
                      isSuccess &&
                      chain?.id === chainId &&
                      submissionsOpen &&
                      isAfter(new Date(), submissionsOpen) &&
                      votesOpen &&
                      isBefore(new Date(), votesOpen) && (
                        <DialogModalSendProposal
                          isOpen={isSubmitProposalModalOpen}
                          setIsOpen={setIsSubmitProposalModalOpen}
                        />
                      )}
                    {!isLoading && isSuccess && chain?.id === chainId && (
                      <DialogModalDeleteProposal
                        isOpen={isDeleteProposalModalOpen}
                        setIsOpen={setIsDeleteProposalModalOpen}
                      />
                    )}
                    {!isLoading &&
                      isSuccess &&
                      chain?.id === chainId &&
                      votesOpen &&
                      isAfter(new Date(), votesOpen) &&
                      votesClose &&
                      isBefore(new Date(), votesClose) && (
                        <DialogModalVoteForProposal isOpen={isCastVotesModalOpen} setIsOpen={setIsCastVotesModalOpen} />
                      )}
                  </div>
                </>
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
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div role="alert" className="container m-auto sm:text-center">
          <p className="text-2xl font-black mb-3 text-primary-10">Something went wrong</p>
          <p className="text-neutral-12 mb-6">{error?.message ?? error}</p>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      )}
    >
      <ContestWrapper>
        <ProposalWrapper>
          <UserWrapper>
            <SubmitProposalWrapper>
              <CastVotesWrapper>
                <DeleteProposalWrapper>
                  <LayoutViewContest>{page}</LayoutViewContest>
                </DeleteProposalWrapper>
              </CastVotesWrapper>
            </SubmitProposalWrapper>
          </UserWrapper>
        </ProposalWrapper>
      </ContestWrapper>
    </ErrorBoundary>,
  );
};
