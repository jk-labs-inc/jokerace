import RewardsNumberDisplay from "@components/_pages/Contest/Rewards/components/UI/Display/Number";
import { Reward } from "@components/_pages/Contest/Rewards/types";
import RefreshButton from "@components/UI/RefreshButton";
import { FC } from "react";

interface RewardsPlayerViewClaimRewardTotalRewardsProps {
  totalRewards: Reward[];
  isContestInProcess: boolean;
  onRefresh?: () => void;
}

const RewardsPlayerViewClaimRewardTotalRewards: FC<RewardsPlayerViewClaimRewardTotalRewardsProps> = ({
  totalRewards,
  isContestInProcess,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <p className="text-[24px] text-neutral-11">my rewards</p>
          <RefreshButton onRefresh={() => onRefresh?.()} size="sm" />
        </div>
        {isContestInProcess ? <p className="text-[12px] text-neutral-9">if contest ended now</p> : null}
      </div>

      {totalRewards.map((reward, index) => (
        <RewardsNumberDisplay
          key={index}
          value={reward.value}
          symbol={reward.symbol}
          decimals={reward.decimals}
          index={index}
          isBold={true}
        />
      ))}
    </div>
  );
};

export default RewardsPlayerViewClaimRewardTotalRewards;
