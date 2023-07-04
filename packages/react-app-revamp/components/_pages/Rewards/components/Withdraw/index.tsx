import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import { Tab } from "@headlessui/react";
import { FC, Fragment } from "react";
import { useNetwork } from "wagmi";

interface ContestWithdrawRewardsProps {
  rewardsStore: any;
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({ rewardsStore }) => {
  const { chain } = useNetwork();

  return (
    <div className="w-1/2">
      <Tab.Group>
        <Tab.List className="animate-appear overflow-hidden text-xs font-medium mb-6 divide-i divide-neutral-4 flex rounded-full border-solid border border-neutral-4">
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
              <ul className="flex flex-col items-start space-y-6">
                {rewardsStore?.rewards?.balance?.map((token: { contractAddress: string }) => (
                  <li className="flex flex-col items-start" key={`withdraw-erc20-${token.contractAddress}`}>
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
                <p className="italic animate-appear text-neutral-11">No balance found for ERC20 tokens.</p>
              </>
            )}
          </Tab.Panel>
          <Tab.Panel className="flex flex-col items-start">
            <ButtonWithdrawNativeReward
              contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
              abiRewardsModule={rewardsStore.rewards.abi}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ContestWithdrawRewards;
