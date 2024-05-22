import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import { Tab } from "@headlessui/react";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { FC, Fragment } from "react";
import { useAccount, useBalance } from "wagmi";

interface ContestWithdrawRewardsProps {
  rewardsStore: any;
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({ rewardsStore }) => {
  const { chain } = useAccount();
  const { unpaidTokens } = useUnpaidRewardTokens();
  const nativeTokenBalance = useBalance({
    address: rewardsStore?.rewards?.contractAddress as `0x${string}`,
    chainId: chain?.id,
  });

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="animate-appear max-w-[700px] overflow-hidden text-[16px] font-medium mb-6 divide-neutral-4 flex rounded-full border-solid border border-neutral-4">
          {["ERC20", chain?.nativeCurrency?.symbol].map(tab => (
            <Tab key={tab} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`normal-case p-1 w-1/2 text-center
      ${selected ? "bg-true-white text-positive-1 font-bold" : ""}`}
                >
                  {tab}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {unpaidTokens && unpaidTokens.length > 0 ? (
              <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
                {unpaidTokens.map((token, index) => (
                  <ButtonWithdrawERC20Reward
                    key={index}
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                    tokenAddress={token.contractAddress}
                  />
                ))}
              </ul>
            ) : (
              <p className="italic text-[16px] text-neutral-11">No balance found for ERC20 tokens.</p>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {nativeTokenBalance.data && nativeTokenBalance.data?.value > 0 ? (
              <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
                <ButtonWithdrawNativeReward
                  contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                  abiRewardsModule={rewardsStore.rewards.abi}
                />
              </ul>
            ) : (
              <p className="italic text-[16px] text-neutral-11">
                No balance found for $<span className="uppercase">{nativeTokenBalance.data?.symbol}</span>.
              </p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ContestWithdrawRewards;
