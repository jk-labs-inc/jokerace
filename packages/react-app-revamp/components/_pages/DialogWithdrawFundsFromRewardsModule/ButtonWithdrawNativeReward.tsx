import { useWithdrawReward, useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawNativeRewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
}

export const ButtonWithdrawNativeReward = (props: ButtonWithdrawNativeRewardProps) => {
  const { contractRewardsModuleAddress, abiRewardsModule } = props;
  const { queryTokenBalance, handleWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    "native",
  );
  const { isLoading } = useWithdrawRewardStore(state => state);

  return <ButtonWithdraw queryTokenBalance={queryTokenBalance} handleWithdraw={handleWithdraw} isLoading={isLoading} />;
};

export default ButtonWithdrawNativeReward;
