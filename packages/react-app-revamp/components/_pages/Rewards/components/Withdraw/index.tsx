import ButtonWithdrawERC20Reward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawERC20Reward";
import ButtonWithdrawNativeReward from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdrawNativeReward";
import { RewardModuleInfo } from "@hooks/useRewards/store";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { FC } from "react";

interface ContestWithdrawRewardsProps {
  rewardsStore: RewardModuleInfo;
}

const ContestWithdrawRewards: FC<ContestWithdrawRewardsProps> = ({ rewardsStore }) => {
  const { unpaidTokens, isLoading } = useUnpaidRewardTokens(
    "rewards-module-unpaid-tokens",
    rewardsStore.contractAddress,
    true,
  );

  return (
    <div className="w-full md:w-[600px] mt-14">
      {isLoading ? (
        <p className="loadingDots font-sabo text-[14px] text-neutral-14">Loading rewards</p>
      ) : unpaidTokens && unpaidTokens.length > 0 ? (
        <ul className="flex flex-col gap-3 text-[16px] font-bold list-explainer">
          {unpaidTokens.map((token, index) =>
            token.contractAddress === "native" ? (
              <ButtonWithdrawNativeReward
                key={index}
                contractRewardsModuleAddress={rewardsStore.contractAddress}
                abiRewardsModule={rewardsStore.abi}
                token={{
                  balance: token.tokenBalance,
                  symbol: token.tokenSymbol,
                }}
              />
            ) : (
              <ButtonWithdrawERC20Reward
                key={index}
                contractRewardsModuleAddress={rewardsStore.contractAddress}
                abiRewardsModule={rewardsStore.abi}
                token={{
                  address: token.contractAddress,
                  balance: token.tokenBalance,
                  symbol: token.tokenSymbol,
                }}
              />
            ),
          )}
        </ul>
      ) : (
        <p className="italic text-[16px] text-neutral-11">No balance found for rewards.</p>
      )}
    </div>
  );
};

export default ContestWithdrawRewards;
