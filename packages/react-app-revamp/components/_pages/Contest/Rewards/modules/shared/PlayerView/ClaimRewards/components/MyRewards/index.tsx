import { Reward } from "@components/_pages/Contest/Rewards/types";
import RefreshButton from "@components/UI/RefreshButton";
import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";
import { formatUnits } from "viem";
import { AnimateNumber } from "motion-plus/react";

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
        <AnimateNumber key={index} className="text-[40px] text-neutral-11" suffix={`${reward.currency.toUpperCase()}`}>
          {formatBalance(formatUnits(reward.value, reward.decimals).toString())}
        </AnimateNumber>
      ))}
    </div>
  );
};

export default RewardsPlayerViewClaimRewardTotalRewards;
