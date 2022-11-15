import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import Button from "@components/Button";
import { toast } from "react-hot-toast";

interface ButtonWithdrawErc20RewardProps {
  contractRewardsModuleAddress: string
  abiRewardsModule: any
  tokenAddress: string
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
    <>
      {/* @ts-ignore */}
      <p className="mb-1">Current balance: {parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)}</p>
      <Button
        intent={
          //@ts-ignore
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ? "ghost-primary" : "primary-outline"
        }
        onClick={() => contractWriteWithdrawERC20Reward.write()}
        isLoading={contractWriteWithdrawERC20Reward.isLoading || txWithdrawERC20.isLoading}
        disabled={
          //@ts-ignore
          parseFloat(queryTokenBalance?.data?.formatted).toFixed(4) <= 0.0001 ||
          txWithdrawERC20.isLoading ||
          contractWriteWithdrawERC20Reward.isLoading ||
          contractWriteWithdrawERC20Reward.isSuccess ||
          txWithdrawERC20.isSuccess
        }
      >
        {contractWriteWithdrawERC20Reward.isError || txWithdrawERC20.isError
          ? "Try again"
          : txWithdrawERC20.isSuccess
          ? `${queryTokenBalance?.data?.symbol} withdrawn successfully`
          : contractWriteWithdrawERC20Reward.isLoading || txWithdrawERC20.isLoading
          ? "Withdrawing..."
          : `Withdraw all ${queryTokenBalance.data?.symbol}`}
      </Button>
    </>
  );
};

export default ButtonWithdrawERC20Reward;
