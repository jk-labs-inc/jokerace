import { Distribution, Reward } from "@components/_pages/Contest/Rewards/types";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";
import DistributionItem from "./components/DistributionItem";
import RewardsPlayerViewClaimRewardTotalRewards from "./components/MyRewards";
import { combineDistributions } from "./helpers/distribution";

interface RewardsPlayerViewClaimRewardsProps {
  totalRewards: Reward[];
  claimableDistributions: Distribution[];
  claimedDistributions?: Distribution[];
  contestStatus: ContestStatus;
  onClaim: (currency: string, rank: number) => void;
  onRefresh?: () => void;
  isClaimLoading: (rank: number) => boolean;
  isClaimSuccess: (rank: number) => boolean;
}

const RewardsPlayerViewClaimRewards: FC<RewardsPlayerViewClaimRewardsProps> = ({
  totalRewards,
  claimableDistributions,
  claimedDistributions = [],
  contestStatus,
  onClaim,
  onRefresh,
  isClaimLoading,
  isClaimSuccess,
}) => {
  const isActive = contestStatus === ContestStatus.VotingOpen;
  const combinedDistributions = combineDistributions(claimableDistributions, claimedDistributions);

  const isRankClaimed = (rank: number) => {
    return claimedDistributions.some(dist => dist.rank === rank) || isClaimSuccess(rank);
  };

  return (
    <div className="flex flex-col gap-16">
      <RewardsPlayerViewClaimRewardTotalRewards
        totalRewards={totalRewards}
        onRefresh={onRefresh}
        isContestInProcess={isActive}
      />

      {combinedDistributions.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-[24px] text-neutral-11">distribution</p>
            {isActive ? <p className="text-[12px] text-neutral-9">if contest ended now</p> : null}
          </div>

          {combinedDistributions.map(distribution => (
            <DistributionItem
              key={distribution.rank}
              distribution={distribution}
              isActive={isActive}
              isClaimLoading={isClaimLoading}
              isRankClaimed={isRankClaimed}
              onClaim={onClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsPlayerViewClaimRewards;
