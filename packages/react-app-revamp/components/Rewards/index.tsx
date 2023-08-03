/* eslint-disable react-hooks/exhaustive-deps */
import ButtonV3 from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import Loader from "@components/UI/Loader";
import DialogCheckBalanceRewardsModule from "@components/_pages/DialogCheckBalanceRewardsModule";
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import CreateRewardsPool from "@components/_pages/Rewards/components/Create";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import ContestWithdrawRewards from "@components/_pages/Rewards/components/Withdraw";
import RewardsDistributionTable from "@components/_pages/RewardsDistributionTable/components";
import { RewardsTableShare } from "@components/_pages/RewardsTable";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const ContestRewards = () => {
  const { isSuccess, isLoading, supportsRewardsModule, contestAuthorEthereumAddress } = useContestStore(state => state);
  const displayCreatePool = useDeployRewardsStore(state => state.displayCreatePool);
  const [isDeployRewardsOpen, setIsDeployRewardsOpen] = useState(false);
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const [isCheckBalanceRewardsOpen, setIsCheckBalanceRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const currentAccount = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { asPath } = useRouter();
  const creator = contestAuthorEthereumAddress == currentAccount.address;

  useEffect(() => {
    if (rewardsStore?.isSuccess) return;
    if (supportsRewardsModule) getContestRewardsModule();
  }, [rewardsStore?.isSuccess, supportsRewardsModule]);

  if (!supportsRewardsModule && !creator) {
    return null;
  }

  if (!supportsRewardsModule && creator) {
    return (
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">create a rewards pool</p>
        <div className="flex flex-col gap-4 text-[16px] text-neutral-11">
          <p>
            a rewards pool incentivizes players, compensates winners, and is
            <br /> open for <i>anyone</i> to fund
          </p>
          <p>
            when you create a rewards pool, you’ll set what percent of rewards <br />
            each winner receives—and then you’ll have the option to fund it
            <br /> with whatever tokens you like.
          </p>
          <ButtonV3
            color={`bg-gradient-create rounded-[40px] mt-3`}
            size="large"
            onClick={() => setIsDeployRewardsOpen(true)}
          >
            create rewards pool
          </ButtonV3>
        </div>
        <DialogModalV3
          isOpen={isDeployRewardsOpen}
          setIsOpen={value => setIsDeployRewardsOpen(value)}
          title="rewards"
          className="xl:w-[1110px] 3xl:w-[1300px] h-[850px]"
        >
          <div className="md:pl-[50px] lg:pl-[100px]">
            <div className="pt-[50px]">{displayCreatePool ? <CreateRewardsPool /> : <CreateRewardsFunding />}</div>
          </div>
        </DialogModalV3>
      </div>
    );
  }

  return (
    <>
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading && (
            <>
              <Loader scale="page">Loading rewards...</Loader>
            </>
          )}
          {rewardsStore.isSuccess && (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-12">
                <p className="text-[24px] text-neutral-11 font-bold">rewards pool parameters</p>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] text-neutral-11 font-bold">
                      address for anyone to send tokens to fund the pool:
                    </p>
                    <a
                      className="text-positive-11 text-[16px] font-bold underline break-all"
                      href={`${rewardsStore?.rewards?.blockExplorers?.url}address/${rewardsStore?.rewards?.contractAddress}`}
                    >
                      {rewardsStore?.rewards?.contractAddress}
                    </a>
                    <p className="text-[12px] font-bold text-neutral-11">
                      please note this is unaudited code that can be verified on our{" "}
                      <a
                        className="underline"
                        href="https://github.com/jk-labs-inc/jokerace"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github
                      </a>
                      .
                      <br />
                      {creator ? (
                        <>
                          you can withdraw funds at any time{" "}
                          <span
                            className="text-positive-11 cursor-pointer"
                            onClick={() => setIsWithdrawRewardsOpen(true)}
                          >
                            here
                          </span>
                          .
                        </>
                      ) : (
                        <>the contest creator can withdraw funds at any time.</>
                      )}
                    </p>
                  </div>
                  <p className="text-[16px] text-neutral-11 font-bold">distribution of rewards in pool:</p>
                  {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                    <RewardsTableShare
                      key={`rank-${`${payee}`}`}
                      chainId={
                        chains.filter(
                          chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
                        )?.[0]?.id
                      }
                      payee={payee}
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                      totalShares={rewardsStore.rewards.totalShares}
                      isLast={index === rewardsStore.rewards.payees.length - 1}
                    />
                  ))}
                  {creator && (
                    <>
                      <ButtonV3
                        color={`bg-gradient-create rounded-[40px] mt-3`}
                        size="large"
                        onClick={() => setIsFundRewardsOpen(true)}
                      >
                        fund pool
                      </ButtonV3>
                      <DialogModalV3
                        isOpen={isFundRewardsOpen}
                        setIsOpen={value => setIsFundRewardsOpen(value)}
                        title="rewards"
                        className="xl:w-[1110px] 3xl:w-[1300px] h-[850px]"
                      >
                        <div className="md:pl-[50px] lg:pl-[100px]">
                          <div className="pt-[50px]">{<CreateRewardsFunding isFundingForTheFirstTime={false} />}</div>
                        </div>
                      </DialogModalV3>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-1">
                  <p className="text-[24px] text-neutral-11 font-bold">rewards to distribute</p>
                  <p className="text-[12px]">
                    If you want to determine for yourself if a custom token is included in the rewards, you can do it{" "}
                    <span
                      className="text-positive-11 cursor-pointer font-bold"
                      onClick={() => setIsCheckBalanceRewardsOpen(true)}
                    >
                      here
                    </span>
                    .
                  </p>
                </div>

                {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                  <RewardsDistributionTable
                    key={index}
                    chainId={
                      chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]
                        ?.id
                    }
                    payee={payee}
                    erc20Tokens={rewardsStore.rewards.balance}
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-1">
                  <p className="text-[24px] text-neutral-11 font-bold">previously distributed rewards</p>
                </div>

                {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                  <RewardsDistributionTable
                    key={index}
                    chainId={
                      chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]
                        ?.id
                    }
                    payee={payee}
                    erc20Tokens={rewardsStore.rewards.balance}
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                    showPreviouslyDistributedTable
                  />
                ))}
              </div>
            </div>
          )}
          <DialogWithdrawFundsFromRewardsModule isOpen={isWithdrawRewardsOpen} setIsOpen={setIsWithdrawRewardsOpen}>
            <ContestWithdrawRewards rewardsStore={rewardsStore} />
          </DialogWithdrawFundsFromRewardsModule>
          <DialogCheckBalanceRewardsModule
            isOpen={isCheckBalanceRewardsOpen}
            setIsOpen={setIsCheckBalanceRewardsOpen}
          />
        </>
      )}
    </>
  );
};

export default ContestRewards;
