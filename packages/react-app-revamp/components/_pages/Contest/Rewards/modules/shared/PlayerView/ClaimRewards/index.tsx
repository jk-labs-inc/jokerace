import { Distribution, Reward } from "@components/_pages/Contest/Rewards/types";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";
import RewardsPlayerViewClaimRewardTotalRewards from "./components/MyRewards";
import RewardItem from "./components/RewardItem";
import { getSortedRanks, groupRewardsByRank } from "./helpers/distribution";

interface RewardsPlayerViewClaimRewardsProps {
  totalRewards: Reward[];
  claimableDistributions: Distribution[];
  claimedDistributions?: Distribution[];
  contestStatus: ContestStatus;
  isClaimLoading: (rank: number, tokenAddress: string) => boolean;
  isClaimSuccess: (rank: number, tokenAddress: string) => boolean;
  onClaim: (rank: number, value: bigint, tokenAddress: string) => void;
  isAdditionalStatisticsSupported?: boolean;
  onRefresh?: () => void;
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
  isAdditionalStatisticsSupported,
}) => {
  const isActive = contestStatus === ContestStatus.VotingOpen;
  const groupedByRank = groupRewardsByRank(claimableDistributions, claimedDistributions);
  const sortedRanks = getSortedRanks(groupedByRank);

  return (
    <div className="flex flex-col gap-16">
      <RewardsPlayerViewClaimRewardTotalRewards
        totalRewards={totalRewards}
        onRefresh={onRefresh}
        isContestInProcess={isActive}
      />

      {sortedRanks.length > 0 && (
        <div className={`flex flex-col ${isActive ? "gap-6" : "gap-12"}`}>
          <div className="flex flex-col gap-1">
            <p className="text-[24px] text-neutral-11">distribution</p>
            {isActive ? <p className="text-[12px] text-neutral-9">if contest ended now</p> : null}
          </div>
          <div className="flex flex-col gap-12">
            {sortedRanks.map(rank => (
              <div key={rank} className="flex flex-col gap-2">
                <p className="text-[16px] text-neutral-9 font-bold">
                  {rank}
                  <sup>{returnOnlySuffix(rank)}</sup> place
                </p>
                {groupedByRank
                  .get(rank)
                  ?.map((item, idx) => (
                    <RewardItem
                      key={`${item.reward.address}-${item.reward.value.toString()}-${item.claimed}-${idx}`}
                      reward={item.reward}
                      rank={rank}
                      isActive={isActive}
                      isClaimLoading={isClaimLoading}
                      isRankClaimed={() => item.claimed}
                      isClaimSuccess={isClaimSuccess}
                      isAdditionalStatisticsSupported={isAdditionalStatisticsSupported}
                      onClaim={onClaim}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPlayerViewClaimRewards;
