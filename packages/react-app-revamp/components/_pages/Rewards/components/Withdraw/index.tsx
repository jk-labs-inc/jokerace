import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import { Tab } from "@headlessui/react";
import { FC, Fragment } from "react";
import { useBalance, useNetwork } from "wagmi";

interface ContestWithdrawRewardsProps {
  rewardsStore: any;
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({ rewardsStore }) => {
  const { chain } = useNetwork();
  const nativeTokenBalance = useBalance({
    addressOrName: rewardsStore?.rewards?.contractAddress,
    chainId: chain?.id,
  });

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="animate-appear w-[400px] overflow-hidden text-[16px] font-medium mb-6 divide-neutral-4 flex rounded-full border-solid border border-neutral-4">
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
            {rewardsStore?.rewards?.balance?.length ? (
              <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
                {rewardsStore?.rewards?.balance?.map((token: { contractAddress: string }, index: number) => (
                  <li className="flex items-center" key={index}>
                    <ButtonWithdrawERC20Reward
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                      tokenAddress={token.contractAddress}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="italic text-[16px] animate-appear text-neutral-11">No balance found for ERC20 tokens.</p>
              </>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {nativeTokenBalance.data?.value.gt(0) ? (
              <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-explainer">
                <li className="flex items-center">
                  <ButtonWithdrawNativeReward
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                  />
                </li>
              </ul>
            ) : (
              <p className="italic text-[16px] animate-appear text-neutral-11">
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
