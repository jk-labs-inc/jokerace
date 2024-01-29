import { DistributableReward } from "./components/DistributableReward";
import { PreviouslyDistributedReward } from "./components/PreviouslyDistributedReward";

export interface RewardProps {
  queryTokenBalance: any;
  rewardsReleasable: number;
  rewardsReleased: number;
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
    rewardsReleasable,
    rewardsReleased,
    showPreviouslyDistributed,
    isReleasedRewardsLoading,
    isDistributeRewardsLoading,
    isReleasableRewardsLoading,
  } = props;

  if (showPreviouslyDistributed) {
    return (
      <PreviouslyDistributedReward
        queryTokenBalance={queryTokenBalance}
        rewardsReleased={rewardsReleased}
        isReleasedRewardsLoading={isReleasedRewardsLoading}
      />
    );
  }

  return (
    <DistributableReward
      queryTokenBalance={queryTokenBalance}
      rewardsReleasable={rewardsReleasable}
      handleDistributeRewards={handleDistributeRewards}
      isReleasableRewardsLoading={isReleasableRewardsLoading}
      isDistributeRewardsLoading={isDistributeRewardsLoading}
    />
  );
};

export default Reward;
