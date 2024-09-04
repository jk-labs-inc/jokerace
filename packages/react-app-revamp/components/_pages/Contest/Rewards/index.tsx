import Loader from "@components/UI/Loader";
import DialogAddFundsToRewardsModule from "@components/_pages/DialogAddFundsToRewardsModule";
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import ContestWithdrawRewards from "@components/_pages/Rewards/components/Withdraw";
import RewardsDistributionTable from "@components/_pages/RewardsDistributionTable/components";
import { RewardsTableShare } from "@components/_pages/RewardsTable";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewardsModule from "./components/CreateRewardsModule";
import NoRewardsInfo from "./components/NoRewards";
import { FOOTER_LINKS } from "@config/links";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import RewardsPreviouslyDistributedTable from "@components/_pages/RewardsPreviouslyDistributedTable";

const ContestRewards = () => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const chainExplorer = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.blockExplorers?.default.url;
  const {
    isSuccess,
    isLoading,
    supportsRewardsModule,
    contestAuthorEthereumAddress,
    rewardsAbi,
    sortingEnabled,
    contestMaxProposalCount,
    version,
    downvotingAllowed,
    rewardsModuleAddress,
  } = useContestStore(state => state);
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const {
    data: releasableRewards,
    isLoading: isReleasableRewardsLoading,
    isError: isReleasableRewardsError,
  } = useReleasableRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings: rewardsStore.rewards.payees,
  });

  const {
    data: releasedRewards,
    isLoading: isReleasedRewardsLoading,
    isError: isReleasedRewardsError,
  } = useReleasedRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings: rewardsStore.rewards.payees,
  });
  const creator = contestAuthorEthereumAddress === accountAddress;
  const githubLink = FOOTER_LINKS.find(link => link.label === "Github");

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  useEffect(() => {
    if (rewardsStore?.isSuccess) return;
    if (supportsRewardsModule) getContestRewardsModule();
  }, [rewardsStore?.isSuccess, supportsRewardsModule]);

  if (!supportsRewardsModule && !creator) {
    return <NoRewardsInfo />;
  }

  if (!supportsRewardsModule && creator) {
    return (
      <CreateRewardsModule
        contestMaxProposalCount={contestMaxProposalCount}
        downvotingAllowed={downvotingAllowed}
        sortingEnabled={sortingEnabled}
        version={version}
      />
    );
  }

  return (
    <div className="animate-reveal">
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading && <Loader>Loading rewards</Loader>}
          {rewardsStore.isSuccess && (
            <div className="flex flex-col gap-12">
              <div className={`flex flex-col gap-8 border-b border-primary-2 ${creator ? "pb-8" : ""}`}>
                <p className="text-[24px] text-true-white font-bold">rewards pool configuration</p>
                <div className="flex flex-col gap-3">
                  <p className="text-neutral-9">rewards pool address:</p>
                  <a
                    href={`${chainExplorer}/address/${rewardsStore.rewards.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] text-positive-11 font-bold hover:text-positive-9 transition-colors duration-300 underline"
                  >
                    {rewardsStore.rewards.contractAddress}
                  </a>
                  <p className="text-[12px] font-bold text-neutral-9">
                    please note the contest creator can withdraw funds at any time. <br />
                    this code can be verified on our{" "}
                    <a href={githubLink?.href} target="_blank" rel="noreferrer" className="underline">
                      {githubLink?.label}
                    </a>
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-8">
                    <p className="text-[16px] text-neutral-9 font-bold">distribution of rewards in pool:</p>
                    <div className="flex flex-col gap-2">
                      {rewardsStore?.rewards?.payees?.map((payee: number) => (
                        <RewardsTableShare
                          key={`rank-${`${payee}`}`}
                          totalPayees={rewardsStore.rewards.payees.length}
                          chainId={chainId}
                          payee={payee}
                          contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                          abiRewardsModule={rewardsStore.rewards.abi}
                          totalShares={rewardsStore.rewards.totalShares}
                        />
                      ))}
                    </div>
                  </div>

                  {creator ? (
                    <div className="flex gap-8 items-center">
                      <button
                        className="bg-transparent text-positive-11 text-[16px] hover:text-positive-9 transition-colors duration-300"
                        onClick={() => setIsFundRewardsOpen(true)}
                      >
                        add funds
                      </button>
                      {releasableRewards && releasableRewards.length > 0 ? (
                        <button
                          className="bg-transparent text-negative-11 text-[16px] hover:text-negative-10 transition-colors duration-300"
                          onClick={() => setIsWithdrawRewardsOpen(true)}
                        >
                          remove funds
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              {!isReleasableRewardsLoading && !isReleasableRewardsError && releasableRewards ? (
                <div className="flex flex-col gap-8 border-b border-primary-2 pb-8">
                  <p className="text-[24px] text-neutral-11 font-bold">rewards to distribute</p>
                  {rewardsStore?.rewards?.payees?.map((payee: number, index: number) => (
                    <RewardsDistributionTable
                      key={index}
                      chainId={chainId}
                      payee={payee}
                      releasableRewards={releasableRewards}
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                    />
                  ))}
                </div>
              ) : isReleasableRewardsError ? (
                <p className="text-negative-11 text-[16px]">
                  Error loading releasable rewards. Please try again later.
                </p>
              ) : null}
              {releasedRewards ? (
                <div className="flex flex-col gap-8">
                  <p className="text-[24px] text-neutral-11 font-bold">previously distributed rewards</p>
                  {rewardsStore?.rewards?.payees?.map((payee: number, index: number) => (
                    <RewardsPreviouslyDistributedTable
                      key={index}
                      chainId={chainId}
                      payee={payee}
                      releasedRewards={releasedRewards}
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <DialogAddFundsToRewardsModule isOpen={isFundRewardsOpen} setIsOpen={setIsFundRewardsOpen} />
          <DialogWithdrawFundsFromRewardsModule isOpen={isWithdrawRewardsOpen} setIsOpen={setIsWithdrawRewardsOpen}>
            {releasableRewards ? (
              <ContestWithdrawRewards
                releasableRewards={releasableRewards}
                rewardsStore={rewardsStore.rewards}
                isReleasableRewardsLoading={isReleasableRewardsLoading}
              />
            ) : null}
          </DialogWithdrawFundsFromRewardsModule>
        </>
      )}
    </div>
  );
};

export default ContestRewards;
