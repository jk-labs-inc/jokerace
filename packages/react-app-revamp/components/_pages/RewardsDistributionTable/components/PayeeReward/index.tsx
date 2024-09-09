import { useDistributeRewards } from "@hooks/useDistributeRewards";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { Abi } from "viem";
import Reward from "../Reward";

interface PayeeRewardProps {
  payee: number;
  token: TokenInfo;
  share: number;
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
}

export const PayeeReward = (props: PayeeRewardProps) => {
  const { payee, token, share, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const { handleDistributeRewards } = useDistributeRewards(
    Number(payee),
    Number(share),
    contractRewardsModuleAddress,
    abiRewardsModule,
    chainId,
    token.address,
    token.amount ?? 0n,
    token.decimals ?? 18,
  );

  return <Reward token={token} handleDistributeRewards={handleDistributeRewards} />;
};

export default PayeeReward;
