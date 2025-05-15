import { Distribution } from "@components/_pages/Contest/Rewards/types";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { FC } from "react";
import RewardItem from "../RewardItem";

interface DistributionItemProps {
  distribution: Distribution;
  isActive: boolean;
  isClaimLoading: (rank: number) => boolean;
  isRankClaimed: (rank: number) => boolean;
  onClaim: (currency: string, rank: number) => void;
}

const DistributionItem: FC<DistributionItemProps> = ({
  distribution,
  isActive,
  isClaimLoading,
  isRankClaimed,
  onClaim,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-neutral-9 font-bold">
        {distribution.rank}
        <sup>{returnOnlySuffix(distribution.rank)}</sup> place
      </p>

      {distribution.rewards.map((reward, rewardIndex) => (
        <RewardItem
          key={rewardIndex}
          reward={reward}
          rank={distribution.rank}
          isActive={isActive}
          isClaimLoading={isClaimLoading}
          isRankClaimed={isRankClaimed}
          onClaim={onClaim}
        />
      ))}
    </div>
  );
};

export default DistributionItem;
