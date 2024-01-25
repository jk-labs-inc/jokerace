import { useWithdrawReward, useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawErc20RewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  tokenAddress: string;
}

export const ButtonWithdrawERC20Reward = (props: ButtonWithdrawErc20RewardProps) => {
  const { contractRewardsModuleAddress, tokenAddress, abiRewardsModule } = props;
  const { queryTokenBalance, handleWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    "erc20",
    tokenAddress,
  );
  const { isLoading } = useWithdrawRewardStore(state => state);

  return <ButtonWithdraw queryTokenBalance={queryTokenBalance} handleWithdraw={handleWithdraw} isLoading={isLoading} />;
};

export default ButtonWithdrawERC20Reward;
