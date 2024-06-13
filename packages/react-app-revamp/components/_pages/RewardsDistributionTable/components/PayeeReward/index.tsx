import { useDistributeRewards } from "@hooks/useDistributeRewards";
import Reward from "../Reward";
import { Abi } from "viem";
import { ERC20Token } from "..";

interface PayeeRewardProps {
  payee: number;
  token: ERC20Token;
  share: number;
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
}

export const PayeeReward = (props: PayeeRewardProps) => {
  const { payee, token, share, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const { queryTokenBalance, queryRankRewardsReleasable, handleDistributeRewards } = useDistributeRewards(
    Number(payee),
    Number(share),
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    token.contractAddress,
    token.decimals,
  );

  return (
    <Reward
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      handleDistributeRewards={handleDistributeRewards}
    />
  );
};

export default PayeeReward;
