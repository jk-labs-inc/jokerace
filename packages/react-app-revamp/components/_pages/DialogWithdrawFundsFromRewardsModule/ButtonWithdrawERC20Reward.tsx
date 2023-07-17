import { useWithdrawReward } from "@hooks/useWithdrawRewards";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawErc20RewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  tokenAddress: string;
}

export const ButtonWithdrawERC20Reward = (props: ButtonWithdrawErc20RewardProps) => {
  const { contractRewardsModuleAddress, tokenAddress, abiRewardsModule } = props;
  const { queryTokenBalance, contractWriteWithdrawReward, txWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    "erc20",
    tokenAddress,
  );

  return (
    <ButtonWithdraw
      contractWriteWithdraw={contractWriteWithdrawReward}
      queryTokenBalance={queryTokenBalance}
      txWithdraw={txWithdraw}
    />
  );
};

export default ButtonWithdrawERC20Reward;
