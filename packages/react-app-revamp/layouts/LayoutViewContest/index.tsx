/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import ShareDropdown from "@components/Share";
import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import Loader from "@components/UI/Loader";
import { toastError } from "@components/UI/Toast";
import ContestTab from "@components/_pages/Contest/Contest";
import ContestParameters from "@components/_pages/Contest/Parameters";
import ContestRewards from "@components/_pages/Contest/Rewards";
import ContestTabs, { Tab } from "@components/_pages/Contest/components/Tabs";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import CreateContestRewards from "@components/_pages/Create/pages/ContestRewards";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTESTS } from "@config/routes";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { populateBugReportLink } from "@helpers/githubIssue";
import { generateUrlContest } from "@helpers/share";
import { RefreshIcon } from "@heroicons/react/outline";
import { useAccountChange } from "@hooks/useAccountChange";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { useContest } from "@hooks/useContest";
import { ContestWrapper, useContestStore } from "@hooks/useContest/store";
import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { RewardsWrapper } from "@hooks/useRewards/store";
import useUser from "@hooks/useUser";
import { UserWrapper, useUserStore } from "@hooks/useUser/store";
import { readContract } from "@wagmi/core";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUrl } from "nextjs-current-url";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { getLayout as getBaseLayout } from "./../LayoutBase";

const MAX_MS_TIMEOUT: number = 100000000;

const LayoutViewContest = (props: any) => {
  const { asPath, pathname, reload } = useRouter();
  const url = useUrl();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chainName: chainNameFromUrl, address: addressFromUrl } = extractPathSegments(asPath);
  const showRewards = useShowRewardsStore(state => state.showRewards);
  const { isLoading, address, fetchContestInfo, isSuccess, error, chainId, chainName } = useContest();
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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const bugReportLink = populateBugReportLink(url?.href ?? "", account.address ?? "", error);

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
  }, [chainNameFromUrl, addressFromUrl]);

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

  if (error && !isLoading) {
    if (error.includes("RPC")) {
      return (
        <div className="flex flex-col gap-6 m-auto animate-appear">
          <h1 className="text-[40px] lg:text-[40px] font-sabo text-negative-10 text-center">ruh-roh!</h1>
          <p className="text-[16px] font-bold text-neutral-11 text-center">
            it looks like we can’t connect to the chain to load this contest—please check the link as well as any
            malware blockers you have installed, or try on another browser or device. <br />
            if that doesn’t work,{" "}
            <a href={bugReportLink} target="no_blank" className="text-primary-10">
              please file a bug report so we can look into this
            </a>
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-6 m-auto animate-appear">
          <h1 className="text-[40px] lg:text-[40px] font-sabo text-negative-10 text-center">ruh-roh!</h1>
          <p className="text-[16px] font-bold text-neutral-11 text-center">
            we were unable to fetch this contest — please check url to make sure it's accurate <i>or</i> search for
            contests{" "}
            <Link href={ROUTE_VIEW_CONTESTS} className="text-primary-10">
              here
            </Link>
          </p>
        </div>
      );
    }
  }

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-6 md:px-7 lg:w-[750px] mx-auto`}>
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
            {isSuccess && !error && !isLoading && (
              <>
                {displayReloadBanner && (
                  <div className="w-full bg-true-black text-[16px] text-center flex flex-col sticky top-0 gap-1 z-10 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
                    <div className="flex flex-col">
                      <span>Let&apos;s refresh!</span>
                      <p className="font-normal">Looks like live updates were frozen.</p>
                    </div>
                    <ButtonV3 colorClass="bg-gradient-create" onClick={() => reload()}>
                      Refresh
                    </ButtonV3>
                  </div>
                )}
                <div className="animate-appear pt-3 md:pt-0">
                  <div className="flex flex-col mt-6 md:mt-10 gap-4">
                    <p className="text-[16px] md:text-[31px] text-primary-10 font-sabo break-all">{contestName}</p>
                    <div className="flex flex-row gap-3 md:gap-4 items-center">
                      <EthereumAddress
                        ethereumAddress={contestAuthorEthereumAddress}
                        shortenOnFallback
                        textualVersion={isMobile}
                      />

                      {isRewardsLoading && (
                        <SkeletonTheme baseColor="#000000" highlightColor="#212121" duration={1}>
                          <Skeleton
                            borderRadius={10}
                            className="h-8 shrink-0 p-2 border border-neutral-11"
                            width={isMobile ? 100 : 200}
                          />
                        </SkeletonTheme>
                      )}

                      {rewards && !isRewardsLoading && (
                        <div className="flex shrink-0 h-8 p-4 items-center bg-neutral-0 border border-transparent rounded-[10px] text-[16px] font-bold text-neutral-11">
                          {rewards?.token.value} $
                          <span className="uppercase mr-1 truncate inline-block overflow-hidden max-w-[50px] md:max-w-[100px]">
                            {rewards?.token.symbol}
                          </span>
                          {!isMobile ? (
                            <>
                              to {rewards.winners} {rewards.winners > 1 ? "winners" : "winner"}
                            </>
                          ) : null}
                        </div>
                      )}
                      {isMobile ? (
                        <div
                          className="w-8 h-8 flex items-center rounded-[10px] border border-neutral-11"
                          onClick={() =>
                            navigator.share({
                              url: generateUrlContest(address, chainName),
                            })
                          }
                        >
                          <Image src="/forward.svg" alt="share" className="m-auto" width={15} height={13} />
                        </div>
                      ) : (
                        <ShareDropdown contestAddress={address} chain={chainName} contestName={contestName} />
                      )}
                      <div
                        className="standalone-pwa w-8 h-8 items-center rounded-[10px] border border-neutral-11 cursor-pointer"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshIcon className="w-4 h-4 m-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 mb-8 gap-3 flex flex-col">
                    <ContestTabs onChange={tab => setTab(tab)} />
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
          <DeleteProposalWrapper>
            <UserWrapper>
              <CastVotesWrapper>
                <ContractFactoryWrapper>
                  <RewardsWrapper>
                    <LayoutViewContest>{page}</LayoutViewContest>
                  </RewardsWrapper>
                </ContractFactoryWrapper>
              </CastVotesWrapper>
            </UserWrapper>
          </DeleteProposalWrapper>
        </ProposalWrapper>
      </ContestWrapper>
    </ErrorBoundary>,
  );
};
