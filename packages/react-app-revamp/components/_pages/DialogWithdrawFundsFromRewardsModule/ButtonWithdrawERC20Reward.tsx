import { useWithdrawReward, useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { Abi } from "viem";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawErc20RewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  token: {
    address: string;
    balance: string;
    symbol: string;
  };
}

export const ButtonWithdrawERC20Reward = (props: ButtonWithdrawErc20RewardProps) => {
  const { contractRewardsModuleAddress, abiRewardsModule, token } = props;
  const { handleWithdraw } = useWithdrawReward(
    contractRewardsModuleAddress,
    abiRewardsModule,
    "erc20",
    token.balance,
    token.address,
  );
  const { isLoading } = useWithdrawRewardStore(state => state);

  return <ButtonWithdraw token={token} handleWithdraw={handleWithdraw} isLoading={isLoading} />;
};

export default ButtonWithdrawERC20Reward;
