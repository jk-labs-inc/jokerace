import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import Button from "@components/Button";
import { toast } from "react-hot-toast";

export const ButtonWithdrawNativeReward = (props: any) => {
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
      //@ts-ignore
      toast.error("Something went wrong and the funds couldn't be withdrawn  :", e?.message);
    },
    onSuccess() {
      toast.success("Funds withdrawn successfully !");
    },
  });

  return (
    <>
      {/* @ts-ignore */}
      <p className="mb-1">Current balance: {parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)}</p>
      <Button
        intent={
          /* @ts-ignore */
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ? "ghost-primary" : "primary-outline"
        }
        onClick={() => contractWriteWithdrawNativeReward.write()}
        isLoading={contractWriteWithdrawNativeReward.isLoading || txWithdrawNative.isLoading}
        disabled={
          //@ts-ignore
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ||
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
          : contractWriteWithdrawNativeReward.isLoading || txWithdrawNative.isLoading
          ? "Withdrawing..."
          : `Withdraw all`}
      </Button>
    </>
  );
};

export default ButtonWithdrawNativeReward;
