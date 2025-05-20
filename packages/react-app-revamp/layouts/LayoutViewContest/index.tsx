"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import Loader from "@components/UI/Loader";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestTab from "@components/_pages/Contest/Contest";
import ContestExtensions from "@components/_pages/Contest/Extensions";
import ContestParameters from "@components/_pages/Contest/Parameters";
import ContestRewards from "@components/_pages/Contest/Rewards";
import ContestImage from "@components/_pages/Contest/components/ContestImage";
import ContestName from "@components/_pages/Contest/components/ContestName";
import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import ContestRewardsInfo from "@components/_pages/Contest/components/RewardsInfo";
import ContestTabs, { Tab } from "@components/_pages/Contest/components/Tabs";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { populateBugReportLink } from "@helpers/githubIssue";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAccountChange } from "@hooks/useAccountChange";
import { ContractConfig, useContest } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import { useContestStatusTimer } from "@hooks/useContestStatusTimer";
import useUser from "@hooks/useUser";
import { usePathname } from "next/navigation";
import { useUrl } from "nextjs-current-url";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useAccountEffect } from "wagmi";
import { useShallow } from "zustand/shallow";
import LayoutViewContestError from "./components/Error";

const LayoutViewContest = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const url = useUrl();
  const { address: accountAddress } = useAccount();
  const { chainName: chainNameFromUrl, address: addressFromUrl } = extractPathSegments(pathname ?? "");
  const chainId = chains.filter(chain => chain.name.toLowerCase() === chainNameFromUrl.toLowerCase())[0]?.id;
  const showRewards = useShowRewardsStore(useShallow(state => state.showRewards));
  const { isLoading, address, fetchContestInfo, isSuccess, error, chainName } = useContest();
  const {
    submissionsOpen,
    votesClose,
    votesOpen,
    contestAuthorEthereumAddress,
    contestName,
    isReadOnly,
    contestAbi,
    contestPrompt,
    canEditTitleAndDescription,
    version,
  } = useContestStore(state => state);
  const accountChanged = useAccountChange();
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { setContestStatus } = useContestStatusStore(state => state);
  const [tab, setTab] = useState<Tab>(Tab.Contest);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { contestImageUrl } = parsePrompt(contestPrompt || "");
  const bugReportLink = populateBugReportLink(url?.href ?? "", accountAddress ?? "", error ?? "");
  const contestStatus = useContestStatusTimer({
    submissionsOpen,
    votesOpen,
    votesClose,
    isLoading,
  });

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  useEffect(() => {
    setContestStatus(contestStatus);
  }, [contestStatus, setContestStatus]);

  useEffect(() => {
    if (isLoading || !isSuccess) return;

    const fetchUserData = async () => {
      if (accountChanged) {
        const contractConfig: ContractConfig = {
          address: address as `0x${string}`,
          abi: contestAbi,
          chainId: chainId,
        };
        await Promise.all([
          checkIfCurrentUserQualifyToSubmit(contractConfig, version),
          checkIfCurrentUserQualifyToVote(contractConfig, version),
        ]);
      }
    };

    fetchUserData();
  }, [accountChanged, isLoading, isSuccess]);

  //TODO: think if we want to fetch rewards module here and pass from there
  useEffect(() => {
    fetchContestInfo();
  }, [chainNameFromUrl, addressFromUrl]);

  useEffect(() => {
    if (showRewards) {
      setTab(Tab.Rewards);
    }
  }, [showRewards]);

  const renderTabs = useMemo<ReactNode>(() => {
    switch (tab) {
      case Tab.Contest:
        return <ContestTab />;
      case Tab.Rewards:
        return (
          <div className="mt-12">
            <ContestRewards />
          </div>
        );
      case Tab.Rules:
        return (
          <div className="mt-12">
            <ContestParameters />
          </div>
        );
      case Tab.Extensions:
        return (
          <div className="mt-12">
            <ContestExtensions />
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
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-6 md:px-0 lg:w-[760px] mx-auto`}>
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
                <div className="animate-reveal pt-3 md:pt-0">
                  <div className="flex flex-col mt-6 md:mt-10 gap-4">
                    <div className="flex flex-col gap-8">
                      {contestImageUrl ? (
                        <div className="hidden md:block">
                          <ContestImage imageUrl={contestImageUrl} />
                        </div>
                      ) : null}
                      <ContestName
                        contestName={contestName}
                        contestAddress={address}
                        chainName={chainName}
                        contestPrompt={contestPrompt}
                        canEditTitle={canEditTitleAndDescription}
                      />
                    </div>

                    <div className={`flex flex-row gap-3 md:gap-4 items-center`}>
                      <div className="flex items-center gap-4">
                        <UserProfileDisplay
                          ethereumAddress={contestAuthorEthereumAddress}
                          shortenOnFallback
                          size={isMobile ? "extraSmall" : "small"}
                        />
                        <ContestRewardsInfo version={version} />
                      </div>

                      <div
                        className="standalone-pwa w-8 h-8 items-center rounded-[10px] border border-neutral-11 cursor-pointer"
                        onClick={() => window.location.reload()}
                      >
                        <ArrowPathIcon className="w-4 h-4 m-auto" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 md:mt-8 mb-4 md:mb-8 gap-3 flex flex-col">
                      <ContestTabs tab={tab} onChange={tab => setTab(tab)} />
                    </div>
                    {renderTabs}

                    {children}
                  </div>
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
