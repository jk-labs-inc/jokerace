import { DistributableReward } from "./components/DistributableReward";

export interface RewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleasable: any;
  showPreviouslyDistributed?: boolean;
  handleDistributeRewards?: () => Promise<void>;
}

export const Reward = (props: RewardProps) => {
  const { queryTokenBalance, queryRankRewardsReleasable, handleDistributeRewards } = props;

  return (
    <DistributableReward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      handleDistributeRewards={handleDistributeRewards}
    />
  );
};

export default Reward;
