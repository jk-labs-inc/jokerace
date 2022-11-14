import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import Button from "@components/Button";
import { toast } from "react-hot-toast";

export const ButtonWithdrawNativeReward = props => {
  const { contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork();
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    watch: true,
  });
  const contractWriteWithdrawNativeReward = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "withdrawRewards()",
    chainId: chain?.id,
    onError(e) {
      toast.error(`${e.cause}: ${e.message}`);
    },
  });

  const txWithdrawNative = useWaitForTransaction({
    hash: contractWriteWithdrawNativeReward?.data?.hash,
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
      onClick={() => contractWriteWithdrawNativeReward.write()}
      isLoading={contractWriteWithdrawNativeReward.isLoading || txWithdrawNative.isLoading}
      disabled={
        parseFloat(queryTokenBalance?.data?.formatted) === 0 ||
        txWithdrawNative.isLoading ||
        contractWriteWithdrawNativeReward.isLoading ||
        contractWriteWithdrawNativeReward.isSuccess ||
        txWithdrawNative.isSuccess
      }
    >
      {contractWriteWithdrawNativeReward.isError || txWithdrawNative.isError
        ? "Try again"
        : txWithdrawNative.isSuccess
        ? `${chain?.nativeCurrency?.symbol} withdrawn successfully`
        : (contractWriteWithdrawNativeReward.isLoading || txWithdrawNative.isLoading)
        ? "Withdrawing..."
        : `Withdraw all`}
    </Button>
  );
};

export default ButtonWithdrawNativeReward;
