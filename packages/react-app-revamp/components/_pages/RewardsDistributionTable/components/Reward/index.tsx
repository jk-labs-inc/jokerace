import { DistributableReward } from "./components/DistributableReward";
import { PreviouslyDistributedReward } from "./components/PreviouslyDistributedReward";

export interface RewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleasable: any;
  queryRankRewardsReleased: any;
  showPreviouslyDistributed?: boolean;
  isReleasableRewardsLoading: boolean;
  isDistributeRewardsLoading: boolean;
  isReleasedRewardsLoading: boolean;
  handleDistributeRewards?: () => Promise<void>;
}

export const Reward = (props: RewardProps) => {
  const {
    queryTokenBalance,
    handleDistributeRewards,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    showPreviouslyDistributed,
    isReleasedRewardsLoading,
    isDistributeRewardsLoading,
    isReleasableRewardsLoading,
  } = props;

  if (showPreviouslyDistributed) {
    return (
      <PreviouslyDistributedReward
        queryTokenBalance={queryTokenBalance}
        queryRankRewardsReleased={queryRankRewardsReleased}
        isReleasedRewardsLoading={isReleasedRewardsLoading}
      />
    );
  }

  return (
    <DistributableReward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      handleDistributeRewards={handleDistributeRewards}
      isReleasableRewardsLoading={isReleasableRewardsLoading}
      isDistributeRewardsLoading={isDistributeRewardsLoading}
    />
  );
};

export default Reward;
