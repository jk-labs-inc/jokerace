import { useWithdrawReward, useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { Abi } from "viem";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawNativeRewardProps {
  token: {
    balance: string;
    symbol: string;
  };
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
}

export const ButtonWithdrawNativeReward = (props: ButtonWithdrawNativeRewardProps) => {
  const { contractRewardsModuleAddress, abiRewardsModule, token } = props;
  const { handleWithdraw } = useWithdrawReward(contractRewardsModuleAddress, abiRewardsModule, "native", token.balance);
  const { isLoading } = useWithdrawRewardStore(state => state);

  return <ButtonWithdraw token={token} handleWithdraw={handleWithdraw} isLoading={isLoading} />;
};

export default ButtonWithdrawNativeReward;
