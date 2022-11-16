import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import ButtonWithdraw from "./ButtonWithdraw";
import { toast } from "react-hot-toast";

interface ButtonWithdrawErc20RewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  tokenAddress: string;
}

export const ButtonWithdrawERC20Reward = (props: ButtonWithdrawErc20RewardProps) => {
  const { contractRewardsModuleAddress, tokenAddress, abiRewardsModule } = props;
  const { chain } = useNetwork();
  const queryTokenBalance = useBalance({
    token: tokenAddress,
    addressOrName: contractRewardsModuleAddress,
    watch: true,
  });
  const contractWriteWithdrawERC20Reward = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "withdrawRewards(address)",
    chainId: chain?.id,
    args: [tokenAddress],
    onError(e) {
      toast.error(`${e.cause}: ${e.message}`);
    },
  });

  const txWithdrawERC20 = useWaitForTransaction({
    hash: contractWriteWithdrawERC20Reward?.data?.hash,
    onError(e) {
      console.error(e);
      //@ts-ignore
      toast.error("Something went wrong and the funds couldn't be withdrawn  :", e?.message);
    },
    onSuccess(data) {
      toast.success("Funds withdrawn successfully !");
    },
  });

  return (
    <ButtonWithdraw
      contractWriteWithdraw={contractWriteWithdrawERC20Reward}
      queryTokenBalance={queryTokenBalance}
      txWithdraw={txWithdrawERC20}
    />
  );
};

export default ButtonWithdrawERC20Reward;
