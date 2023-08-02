import { DistributableReward } from "./components/DistributableReward";
import { PreviouslyDistributedReward } from "./components/PreviouslyDistributedReward";

export interface RewardProps {
  queryTokenBalance: any;
  contractWriteRelease: any;
  txRelease: any;
  queryRankRewardsReleasable: any;
  queryRankRewardsReleased: any;
  showPreviouslyDistributed?: boolean;
}

export const Reward = (props: RewardProps) => {
  const {
    queryTokenBalance,
    contractWriteRelease,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    showPreviouslyDistributed,
    txRelease,
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
      contractWriteRelease={contractWriteRelease}
      txRelease={txRelease}
    />
  );
};

export default Reward;
