import { DistributableReward } from "./components/DistributableReward";
import { PreviouslyDistributedReward } from "./components/PreviouslyDistributedReward";

export interface RewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleasable: any;
  queryRankRewardsReleased: any;
  showPreviouslyDistributed?: boolean;
  handleDistributeRewards?: () => Promise<void>;
}

export const Reward = (props: RewardProps) => {
  const {
    queryTokenBalance,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    showPreviouslyDistributed,
    handleDistributeRewards,
  } = props;

  if (showPreviouslyDistributed) {
    return (
      <PreviouslyDistributedReward
        queryTokenBalance={queryTokenBalance}
        queryRankRewardsReleased={queryRankRewardsReleased}
      />
    );
  }

  return (
    <DistributableReward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      handleDistributeRewards={handleDistributeRewards}
    />
  );
};

export default Reward;
