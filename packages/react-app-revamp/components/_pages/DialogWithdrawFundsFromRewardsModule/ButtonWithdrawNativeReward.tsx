import { useWithdrawReward } from "@hooks/useWithdrawRewards";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawNativeRewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
}

export const ButtonWithdrawNativeReward = (props: ButtonWithdrawNativeRewardProps) => {
  const { contractRewardsModuleAddress, abiRewardsModule } = props;
  const { queryTokenBalance, contractWriteWithdrawReward, txWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    "native",
  );

  return (
    <ButtonWithdraw
      contractWriteWithdraw={contractWriteWithdrawReward}
      queryTokenBalance={queryTokenBalance}
      txWithdraw={txWithdraw}
    />
  );
};

export default ButtonWithdrawNativeReward;
