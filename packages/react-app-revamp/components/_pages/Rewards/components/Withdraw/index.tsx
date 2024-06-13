import ButtonWithdraw from "@components/_pages/DialogWithdrawFundsFromRewardsModule/ButtonWithdraw";
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
          {unpaidTokens.map((token, index) => (
            <ButtonWithdraw
              key={index}
              token={token}
              rewardsModuleAddress={rewardsStore.contractAddress}
              rewardsAbi={rewardsStore.abi}
            />
          ))}
        </ul>
      ) : (
        <p className="italic text-[16px] text-neutral-11">No balance found for rewards.</p>
      )}
    </div>
  );
};

export default ContestWithdrawRewards;
