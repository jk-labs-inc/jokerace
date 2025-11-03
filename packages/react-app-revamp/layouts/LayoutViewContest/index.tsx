"use client";
import Loader from "@components/UI/Loader";
import ContestTabs, { Tab } from "@components/_pages/Contest/components/Tabs";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { populateBugReportLink } from "@helpers/githubIssue";
import { usePathname } from "next/navigation";
import { useUrl } from "nextjs-current-url";
import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import ContestHeader from "./components/ContestHeader";
import ContestTabsContent from "./components/ContestTabsContent";
import LayoutViewContestError from "./components/Error";
import ReadOnlyBanner from "./components/ReadOnlyBanner";
import { getContestImageUrl } from "./helpers/getContestImageUrl";
import { useLayoutViewContest } from "./hooks/useLayoutViewContest";

const LayoutViewContest = () => {
  const pathname = usePathname();
  const url = useUrl();
  const { address: accountAddress } = useAccount();
  const [tab, setTab] = useState<Tab>(Tab.Contest);
  const {
    contestConfig,
    isLoading,
    error,
    contestAuthorEthereumAddress,
    rewardsModuleAddress,
    contestName,
    isReadOnly,
    contestPrompt,
    canEditTitleAndDescription,
  } = useLayoutViewContest();
  const bugReportLink = populateBugReportLink(url?.href ?? "", accountAddress ?? "", error ?? "");
  const contestImageUrl = getContestImageUrl(contestPrompt);

  const excludeTabs = useMemo(() => {
    const tabsToExclude: Tab[] = [];
    if (!rewardsModuleAddress) {
      tabsToExclude.push(Tab.Rewards);
    }
    return tabsToExclude;
  }, [rewardsModuleAddress]);

  if (error && !isLoading) {
    return <LayoutViewContestError error={error} bugReportLink={bugReportLink} />;
  }

  if (isLoading) {
    return <Loader>Loading contest info...</Loader>;
  }

  return (
    <div className={` w-full px-4 md:px-12 lg:px-0 lg:w-[800px] mx-auto`}>
      <div
        className={`md:pt-5 md:pb-20 flex flex-col ${
          pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
        }`}
      >
        <ReadOnlyBanner isReadOnly={isReadOnly} isLoading={isLoading} />

        <ContestHeader
          contestImageUrl={contestImageUrl ?? ""}
          contestName={contestName}
          contestAddress={contestConfig.address}
          chainName={contestConfig.chainName}
          contestPrompt={contestPrompt}
          canEditTitle={canEditTitleAndDescription}
          contestAuthorEthereumAddress={contestAuthorEthereumAddress}
          contestVersion={contestConfig.version}
        />
        <div>
          <div className="mt-4 md:mt-8 mb-4 md:mb-8 gap-3 flex flex-col">
            <ContestTabs tab={tab} excludeTabs={excludeTabs} onChange={tab => setTab(tab)} />
          </div>
          <ContestTabsContent tab={tab} rewardsModuleAddress={rewardsModuleAddress} />
        </div>
      </div>
    </div>
  );
};

export default LayoutViewContest;
