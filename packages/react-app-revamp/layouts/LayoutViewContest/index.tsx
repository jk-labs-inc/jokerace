/* eslint-disable react-hooks/exhaustive-deps */
import ContestParameters from "@components/Parameters";
import ContestRewards from "@components/Rewards";
import ShareDropdown from "@components/Share";
import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import Loader from "@components/UI/Loader";
import { toastError } from "@components/UI/Toast";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import CreateContestRewards from "@components/_pages/Create/pages/ContestRewards";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST } from "@config/routes";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useAccountChange } from "@hooks/useAccountChange";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { useContest } from "@hooks/useContest";
import { ContestWrapper, useContestStore } from "@hooks/useContest/store";
import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { RewardsWrapper } from "@hooks/useRewards/store";
import { SubmitProposalWrapper } from "@hooks/useSubmitProposal/store";
import useUser from "@hooks/useUser";
import { UserWrapper, useUserStore } from "@hooks/useUser/store";
import { readContract } from "@wagmi/core";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount, useNetwork } from "wagmi";
import { getLayout as getBaseLayout } from "./../LayoutBase";
import ContestTab from "./Contest";
import ContestLayoutTabs, { Tab } from "./Tabs";

const MAX_MS_TIMEOUT: number = 100000000;

const LayoutViewContest = (props: any) => {
  const { query, asPath, pathname, reload } = useRouter();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chain } = useNetwork();
  const showRewards = useShowRewardsStore(state => state.showRewards);
  const { isLoading, address, fetchContestInfo, isSuccess, error, retry, chainId, chainName, setChainId } =
    useContest();

  const {
    submissionsOpen,
    votesClose,
    votesOpen,
    contestAuthorEthereumAddress,
    contestName,
    rewards,
    isReadOnly,
    isRewardsLoading,
  } = useContestStore(state => state);
  const accountChanged = useAccountChange();
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();

  const { contestMaxNumberSubmissionsPerUser, setIsLoading: setIsUserStoreLoading } = useUserStore(state => state);
  const { setContestStatus } = useContestStatusStore(state => state);
  const { displayReloadBanner } = useContestEvents();
  const [tab, setTab] = useState<Tab>(Tab.Contest);
  const [previousStatus, setPreviousStatus] = useState(account.status);
  const didConnect = previousStatus === "disconnected" && account.status === "connected";

  useEffect(() => {
    if (account.status === "connecting") return;

    setPreviousStatus(account.status);
  }, [account.status]);

  useEffect(() => {
    const now = moment();
    const formattedSubmissionOpen = moment(submissionsOpen);
    const formattedVotingOpen = moment(votesOpen);
    const formattedVotingClose = moment(votesClose);

    let timeoutId: NodeJS.Timeout;

    const setAndScheduleStatus = (status: ContestStatus, nextStatus: ContestStatus, nextTime: moment.Moment) => {
      setContestStatus(status);
      if (now.isBefore(nextTime)) {
        const msUntilNext = nextTime.diff(now);
        timeoutId = setTimeout(
          () => {
            setContestStatus(nextStatus);
          },
          msUntilNext > MAX_MS_TIMEOUT ? MAX_MS_TIMEOUT : msUntilNext,
        );
      }
    };

    if (now.isBefore(formattedSubmissionOpen)) {
      setAndScheduleStatus(ContestStatus.ContestOpen, ContestStatus.SubmissionOpen, formattedSubmissionOpen);
    } else if (now.isBefore(formattedVotingOpen)) {
      setAndScheduleStatus(ContestStatus.SubmissionOpen, ContestStatus.VotingOpen, formattedVotingOpen);
    } else if (now.isBefore(formattedVotingClose)) {
      setAndScheduleStatus(ContestStatus.VotingOpen, ContestStatus.VotingClosed, formattedVotingClose);
    } else {
      setContestStatus(ContestStatus.VotingClosed);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [submissionsOpen, votesOpen, votesClose, setContestStatus]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (accountChanged || didConnect) {
          setIsUserStoreLoading(true);

          const { abi } = await getContestContractVersion(address, chainId);

          if (!abi) return;

          const contractConfig = {
            address: address as `0x${string}`,
            abi: abi,
            chainId: chainId,
          };

          //@ts-ignore
          const submissionMerkleRoot = (await readContract({
            ...contractConfig,
            functionName: "submissionMerkleRoot",
          })) as string;

          await Promise.all([
            checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser),
            checkIfCurrentUserQualifyToVote(),
          ]);

          setIsUserStoreLoading(false);
        }
      } catch (error) {
        setIsUserStoreLoading(false);
        toastError("we couldn't fetch user data, please try again!");
      }
    };

    fetchUserData();
  }, [accountChanged, didConnect]);

  useEffect(() => {
    fetchContestInfo();
  }, [asPath.split("/")[2], asPath.split("/")[3]]);

  const renderTabs = useMemo<ReactNode>(() => {
    switch (tab) {
      case Tab.Contest:
        return (
          <div className="animate-apppear">
            <ContestTab />
          </div>
        );
      case Tab.Rewards:
        return (
          <div className="mt-8 animate-appear">
            <ContestRewards />
          </div>
        );
      case Tab.Parameters:
        return (
          <div className="mt-8 animate-appear">
            <ContestParameters />
          </div>
        );
      default:
        break;
    }
  }, [tab]);

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-7 lg:w-[750px] mx-auto`}>
      <div
        className={`md:pt-5 md:pb-20 flex flex-col ${
          pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
        }`}
      >
        {isLoading && (
          <div className="animate-appear">
            <Loader scale="page">Loading contest info...</Loader>
          </div>
        )}

        {isReadOnly && !isLoading && (
          <div className="w-full bg-true-black text-[16px] text-center flex flex-col gap-1 border border-neutral-11 rounded-[10px] py-2 px-4 items-center shadow-timer-container">
            <div className="flex flex-col text-start">
              <p>
                missing environmental variables limit some functionalities to <b>read mode</b>.
              </p>
              <p>
                for more details, visit{" "}
                <a className="text-positive-11" href="https://github.com/jk-labs-inc/jokerace#readme" target="_blank">
                  <b>here!</b>
                </a>
              </p>
            </div>
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
                {displayReloadBanner && (
                  <div className="w-full bg-true-black text-[16px] text-center flex flex-col sticky top-0 gap-1 z-10 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
                    <div className="flex flex-col">
                      <span>Let&apos;s refresh!</span>
                      <p className="font-normal">Looks like live updates were frozen.</p>
                    </div>
                    <ButtonV3 color="bg-gradient-create" onClick={() => reload()}>
                      Refresh
                    </ButtonV3>
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

                  <div className="flex flex-col mt-10 gap-4">
                    <p className="text-[31px] text-primary-10 font-sabo break-all">{contestName}</p>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
                      <p className="text-[16px] md:text-[16px] text-neutral-11 font-bold break-all">
                        by{" "}
                        <EthereumAddress
                          ethereumAddress={contestAuthorEthereumAddress}
                          shortenOnFallback
                          textualVersion
                        />
                      </p>

                      {isRewardsLoading && (
                        <SkeletonTheme baseColor="#000000" highlightColor="#212121" duration={1}>
                          <Skeleton
                            borderRadius={10}
                            className="h-8 shrink-0 p-2 border border-neutral-11"
                            width={200}
                          />
                        </SkeletonTheme>
                      )}

                      {rewards && !isRewardsLoading && (
                        <div className="flex shrink-0 h-8 p-4 items-center bg-neutral-0 border border-transparent rounded-[10px] text-[16px] font-bold text-neutral-11">
                          {rewards?.token.value} $<span className="uppercase mr-1">{rewards?.token.symbol} </span> to{" "}
                          {rewards.winners} {rewards.winners > 1 ? "winners" : "winner"}
                        </div>
                      )}

                      <ShareDropdown contestAddress={address} chain={chainName} contestName={contestName} />
                    </div>
                  </div>

                  <div className="mt-8 mb-8 gap-3 flex flex-col">
                    <ContestLayoutTabs onChange={tab => setTab(tab)} />
                  </div>

                  {renderTabs}

                  {props.children}

                  {showRewards && <CreateContestRewards />}
                </div>
              </>
            )}
          </>
        }
      </div>
    </div>
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
                <ContractFactoryWrapper>
                  <RewardsWrapper>
                    <LayoutViewContest>{page}</LayoutViewContest>
                  </RewardsWrapper>
                </ContractFactoryWrapper>
              </CastVotesWrapper>
            </SubmitProposalWrapper>
          </UserWrapper>
        </ProposalWrapper>
      </ContestWrapper>
    </ErrorBoundary>,
  );
};
