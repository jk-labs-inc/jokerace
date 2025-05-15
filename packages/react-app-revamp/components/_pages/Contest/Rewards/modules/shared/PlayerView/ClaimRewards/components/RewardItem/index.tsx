import RewardsClaimButton from "@components/_pages/Contest/Rewards/components/Buttons/Claim";
import { Reward } from "@components/_pages/Contest/Rewards/types";
import GradientText from "@components/UI/GradientText";
import { formatBalance } from "@helpers/formatBalance";
import { AnimateNumber } from "motion-plus/react";
import { FC } from "react";
import { formatUnits } from "viem";

interface RewardItemProps {
  reward: Reward;
  rank: number;
  isActive: boolean;
  isClaimLoading: (rank: number) => boolean;
  isRankClaimed: (rank: number) => boolean;
  onClaim: (currency: string, rank: number) => void;
}

const RewardItem: FC<RewardItemProps> = ({ reward, rank, isActive, isClaimLoading, isRankClaimed, onClaim }) => {
  const renderClaimStatus = () => {
    if (isActive) return null;

    const isClaimed = isRankClaimed(rank);
    const isLoading = isClaimLoading(rank);

    if (isClaimed) {
      return (
        <div className="flex gap-1 items-center text-[14px]">
          🎉
          <GradientText textSizeClassName="text-[14px]" isFontSabo={false}>
            rewards have been claimed!
          </GradientText>
        </div>
      );
    }

    return <RewardsClaimButton onClick={() => onClaim(reward.currency, rank)} isLoading={isLoading} />;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <AnimateNumber className="text-[32px] text-neutral-11" suffix={`${reward.currency.toUpperCase()}`}>
          {formatBalance(formatUnits(reward.value, reward.decimals).toString())}
        </AnimateNumber>
        {isActive ? <p className="text-[12px] text-neutral-9">come back after contest ends to claim rewards!</p> : null}
        {!isActive && renderClaimStatus()}
      </div>
    </div>
  );
};

export default RewardItem;
