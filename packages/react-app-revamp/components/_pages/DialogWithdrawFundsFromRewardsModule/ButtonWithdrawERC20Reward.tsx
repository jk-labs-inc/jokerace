import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import Button from "@components/Button";
import { toast } from "react-hot-toast";

export const ButtonWithdrawERC20Reward = props => {
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
      toast.error("Something went wrong and the funds couldn't be withdrawn  :", e?.message);
    },
    onSuccess(data) {
      toast.success("Funds withdrawn successfully !");
    },
  });

  return (
    <Button
      intent={parseFloat(queryTokenBalance?.data?.formatted) === 0 ? "ghost-primary" : "primary-outline"}
      onClick={() => contractWriteWithdrawERC20Reward.write()}
      isLoading={contractWriteWithdrawERC20Reward.isLoading || txWithdrawERC20.isLoading}
      disabled={
        parseFloat(queryTokenBalance?.data?.formatted) === 0 ||
        txWithdrawERC20.isLoading ||
        contractWriteWithdrawERC20Reward.isLoading ||
        contractWriteWithdrawERC20Reward.isSuccess ||
        txWithdrawERC20.isSuccess
      }
    >
      {contractWriteWithdrawERC20Reward.isError || txWithdrawERC20.isError
        ? "Try again"
        : txWithdrawERC20.isSuccess
        ? `${tokenAddress?.symbol} withdrawn successfully`
        : (contractWriteWithdrawERC20Reward.isLoading || txWithdrawERC20.isLoading)
        ? "Withdrawing..."
        : `Withdraw all ${queryTokenBalance.data?.symbol}`}
    </Button>
  );
};

export default ButtonWithdrawERC20Reward;
