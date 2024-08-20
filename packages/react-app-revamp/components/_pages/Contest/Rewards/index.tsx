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
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useUnpaidRewardTokens } from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewards from "./components/Create";

const ContestRewards = () => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
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
  } = useContestStore(state => state);
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const { unpaidTokens } = useUnpaidRewardTokens("rewards-module-unpaid-tokens", rewardsModuleAddress, true);
  const creator = contestAuthorEthereumAddress === accountAddress;

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardsStore?.isSuccess, supportsRewardsModule]);

  if (!supportsRewardsModule && !creator) {
    return (
      <p className="text-[16px] md:text-[20px] animate-reveal">
        For this contest, there is no rewards module; the contest creator is the only one who may configure one.
      </p>
    );
  }

  if (!supportsRewardsModule && creator) {
    if (version) {
      if (compareVersions(version, "4.1") == -1) {
        if (contestMaxProposalCount > 100) {
          return (
            <p className="text-[16px]">
              For this contest, you cannot create a rewards module; the maximum number of submissions for the contest
              must be <b>100</b> or less in order to be able to create a rewards module.
            </p>
          );
        }
      } else if (compareVersions(version, "4.1") >= 0) {
        if (downvotingAllowed || !sortingEnabled) {
          return (
            <p className="text-[16px]">
              For this contest, you cannot create a rewards module; in order to create rewards module, you need to
              disable downvoting in the creation process.
            </p>
          );
        }
      }
    }

    return <CreateRewards />;
  }

  return (
    <div className="animate-reveal">
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading && <Loader>Loading rewards</Loader>}
          {rewardsStore.isSuccess && (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-8">
                <p className="text-[24px] text-true-white font-bold">live rewards pools</p>
                <div className="flex flex-col gap-6">
                  <p className="text-[20px] text-neutral-11 font-bold">for winners</p>
                  {rewardsStore?.rewards?.payees?.map((payee: number) => (
                    <RewardsTableShare
                      key={`rank-${`${payee}`}`}
                      chainId={chainId}
                      payee={payee}
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                      totalShares={rewardsStore.rewards.totalShares}
                    />
                  ))}
                  {creator ? (
                    <div className="flex gap-8 items-center">
                      <button
                        className="bg-transparent text-positive-11 text-[16px] hover:text-positive-9 transition-colors duration-300"
                        onClick={() => setIsFundRewardsOpen(true)}
                      >
                        add funds
                      </button>
                      {unpaidTokens && unpaidTokens.length > 0 ? (
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
              {unpaidTokens && unpaidTokens.length > 0 ? (
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-1">
                    <p className="text-[24px] text-neutral-11 font-bold">rewards to distribute</p>
                    <p className="text-neutral-11 text-[12px]">
                      <b>in case of ties, funds will be reverted to creator to distribute manually.</b> please be aware
                      of any obligations you might
                      <br /> face for receiving funds.
                    </p>
                  </div>

                  {rewardsStore?.rewards?.payees?.map((payee: number, index: number) => (
                    <RewardsDistributionTable
                      key={index}
                      chainId={chainId}
                      payee={payee}
                      tokens={unpaidTokens}
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
            <ContestWithdrawRewards rewardsStore={rewardsStore.rewards} />
          </DialogWithdrawFundsFromRewardsModule>
        </>
      )}
    </div>
  );
};

export default ContestRewards;
