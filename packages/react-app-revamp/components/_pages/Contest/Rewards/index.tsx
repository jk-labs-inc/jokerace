import Loader from "@components/UI/Loader";
import DialogAddFundsToRewardsModule from "@components/_pages/DialogAddFundsToRewardsModule";
import { RewardsTableShare } from "@components/_pages/RewardsTable";
import { FOOTER_LINKS } from "@config/links";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import CreateRewardsModule from "./components/CreateRewardsModule";
import NoRewardsInfo from "./components/NoRewards";
import RewardsReleasable from "./components/ReleasableRewards";
import RewardsReleased from "./components/ReleasedRewards";

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
    sortingEnabled,
    contestMaxProposalCount,
    version,
    downvotingAllowed,
    rewardsModuleAddress,
  } = useContestStore(
    useShallow(state => ({
      isSuccess: state.isSuccess,
      isLoading: state.isLoading,
      supportsRewardsModule: state.supportsRewardsModule,
      contestAuthorEthereumAddress: state.contestAuthorEthereumAddress,
      sortingEnabled: state.sortingEnabled,
      contestMaxProposalCount: state.contestMaxProposalCount,
      version: state.version,
      downvotingAllowed: state.downvotingAllowed,
      rewardsModuleAddress: state.rewardsModuleAddress,
    })),
  );
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(
    useShallow(state => ({
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
      rewards: state.rewards,
    })),
  );
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
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
                <p className="text-[24px] text-neutral-9 font-bold">rewards pool configuration</p>
                <div className="flex flex-col gap-3">
                  <p className="text-[16px] text-neutral-11 font-bold">rewards pool address:</p>
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
                    .
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-8">
                    <p className="text-[16px] text-neutral-11 font-bold">distribution of rewards in pool:</p>
                    <div className="flex flex-col gap-2">
                      {rewardsStore.rewards.payees.map((payee: number) => (
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
                      <button
                        className="bg-transparent text-negative-11 text-[16px] hover:text-negative-10 transition-colors duration-300"
                        onClick={() => setIsWithdrawRewardsOpen(true)}
                      >
                        remove funds
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-8 border-b border-primary-2 pb-8">
                <p className="text-[24px] text-neutral-9 font-bold">rewards to distribute</p>
                {rewardsStore.rewards.contractAddress &&
                  rewardsStore.rewards.abi &&
                  rewardsStore.rewards.payees.length > 0 && (
                    <RewardsReleasable
                      rewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      chainId={chainId}
                      rewardsAbi={rewardsStore.rewards.abi}
                      rankings={rewardsStore.rewards.payees}
                      isWithdrawRewardsOpen={isWithdrawRewardsOpen}
                      setIsWithdrawRewardsOpen={setIsWithdrawRewardsOpen}
                    />
                  )}
              </div>

              <div className="flex flex-col gap-8">
                <p className="text-[24px] text-neutral-9 font-bold">previously distributed rewards</p>
                {rewardsStore.rewards.contractAddress &&
                  rewardsStore.rewards.abi &&
                  rewardsStore.rewards.payees.length > 0 && (
                    <RewardsReleased
                      rewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      chainId={chainId}
                      rewardsAbi={rewardsStore.rewards.abi}
                      rankings={rewardsStore.rewards.payees}
                    />
                  )}
              </div>
            </div>
          )}

          <DialogAddFundsToRewardsModule isOpen={isFundRewardsOpen} setIsOpen={setIsFundRewardsOpen} />
        </>
      )}
    </div>
  );
};

export default ContestRewards;
