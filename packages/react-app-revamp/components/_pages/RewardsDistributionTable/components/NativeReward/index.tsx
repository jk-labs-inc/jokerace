import { useDistributeRewards } from "@hooks/useDistributeRewards";
import Reward from "../Reward";

interface PayeeNativeRewardProps {
  payee: number;
  share: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  showPreviouslyDistributed?: boolean;
}

export const PayeeNativeReward = (props: PayeeNativeRewardProps) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule, chainId, showPreviouslyDistributed } = props;
  const { queryTokenBalance, queryRankRewardsReleasable, queryRankRewardsReleased, handleDistributeRewards } =
    useDistributeRewards(
      Number(payee),
      Number(share),
      contractRewardsModuleAddress,
      abiRewardsModule,
      chainId,
      "native",
    );

  return (
    <Reward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      queryRankRewardsReleased={queryRankRewardsReleased}
      showPreviouslyDistributed={showPreviouslyDistributed}
      handleDistributeRewards={handleDistributeRewards}
    />
  );
};
