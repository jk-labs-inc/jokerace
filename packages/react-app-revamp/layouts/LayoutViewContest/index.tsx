/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import ShareDropdown from "@components/Share";
import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestTab from "@components/_pages/Contest/Contest";
import ContestParameters from "@components/_pages/Contest/Parameters";
import ContestRewards from "@components/_pages/Contest/Rewards";
import ContestTabs, { Tab } from "@components/_pages/Contest/components/Tabs";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import CreateContestRewards from "@components/_pages/Create/pages/ContestRewards";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { extractPathSegments } from "@helpers/extractPath";
import { populateBugReportLink } from "@helpers/githubIssue";
import { generateUrlContest } from "@helpers/share";
import { MAX_MS_TIMEOUT } from "@helpers/timeout";
import { RefreshIcon } from "@heroicons/react/outline";
import { useAccountChange } from "@hooks/useAccountChange";
import { useContest } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useUser from "@hooks/useUser";
import moment from "moment";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUrl } from "nextjs-current-url";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { useAccount, useAccountEffect } from "wagmi";
import LayoutViewContestError from "./components/Error";

const LayoutViewContest = ({ children }: { children: React.ReactNode }) => {
  const { refresh } = useRouter();
  const pathname = usePathname();
  const url = useUrl();
  const { address: accountAddress } = useAccount();
  const { chainName: chainNameFromUrl, address: addressFromUrl } = extractPathSegments(pathname ?? "");
  const showRewards = useShowRewardsStore(state => state.showRewards);
  const { isLoading, address, fetchContestInfo, isSuccess, error, chainName } = useContest();
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
  const { setContestStatus } = useContestStatusStore(state => state);
  const { displayReloadBanner } = useContestEvents();
  const [tab, setTab] = useState<Tab>(Tab.Contest);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const bugReportLink = populateBugReportLink(url?.href ?? "", accountAddress ?? "", error ?? "");

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

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
      if (accountChanged) {
        await Promise.all([checkIfCurrentUserQualifyToSubmit(), checkIfCurrentUserQualifyToVote()]);
      }
    };

    fetchUserData();
  }, [accountChanged]);

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
    return <LayoutViewContestError error={error} bugReportLink={bugReportLink} />;
  }

  if (isLoading) {
    return <Loader>Loading contest info...</Loader>;
  }

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-6 md:px-7 lg:w-[750px] mx-auto`}>
      <div
        className={`md:pt-5 md:pb-20 flex flex-col ${
          pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
        }`}
      >
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
                    <ButtonV3 colorClass="bg-gradient-create" onClick={() => refresh()}>
                      Refresh
                    </ButtonV3>
                  </div>
                )}
                <div className="animate-appear pt-3 md:pt-0">
                  <div className="flex flex-col mt-6 md:mt-10 gap-4">
                    <p className="text-[16px] md:text-[31px] text-primary-10 font-sabo break-all">{contestName}</p>
                    <div className="flex flex-row gap-3 md:gap-4 items-center">
                      <UserProfileDisplay
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
                        <ShareDropdown
                          contestAddress={address}
                          chain={chainName}
                          contestName={contestName}
                          rewards={rewards}
                        />
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

                  {children}

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

export default LayoutViewContest;
