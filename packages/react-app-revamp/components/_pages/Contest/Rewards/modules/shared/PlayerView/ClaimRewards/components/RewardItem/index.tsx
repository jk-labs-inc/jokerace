import RewardsClaimButton from "@components/_pages/Contest/Rewards/components/UI/Buttons/Claim";
import RewardsNumberDisplay from "@components/_pages/Contest/Rewards/components/UI/Display/Number";
import { Reward } from "@components/_pages/Contest/Rewards/types";
import GradientText from "@components/UI/GradientText";
import { FC } from "react";

interface RewardItemProps {
  reward: Reward;
  rank: number;
  isActive: boolean;
  isClaimLoading: (rank: number, tokenAddress: string) => boolean;
  isRankClaimed: (rank: number) => boolean;
  isClaimSuccess?: (rank: number, tokenAddress: string) => boolean;
  onClaim: (rank: number, value: bigint, tokenAddress: string) => void;
}

const RewardItem: FC<RewardItemProps> = ({
  reward,
  rank,
  isActive,
  isClaimLoading,
  isRankClaimed,
  isClaimSuccess,
  onClaim,
}) => {
  const renderClaimStatus = () => {
    if (isActive) return null;

    const isClaimed = isRankClaimed(rank);
    const isLoading = isClaimLoading(rank, reward.address);
    const isSuccess = isClaimSuccess?.(rank, reward.address) || false;

    if (isClaimed || isSuccess) {
      return (
        <div className="flex gap-1 items-center text-[16px]">
          🎉
          <GradientText textSizeClassName="text-[16px]" isFontSabo={false}>
            rewards have been claimed!
          </GradientText>
        </div>
      );
    }

    return <RewardsClaimButton onClick={() => onClaim(rank, reward.value, reward.address)} isLoading={isLoading} />;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <RewardsNumberDisplay value={reward.value} symbol={reward.symbol} decimals={reward.decimals} index={0} />
        {isActive ? <p className="text-[12px] text-neutral-9">come back after contest ends to claim rewards!</p> : null}
        {!isActive && renderClaimStatus()}
      </div>
    </div>
  );
};

export default RewardItem;
