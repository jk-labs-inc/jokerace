import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { toast } from "react-hot-toast";
import ButtonWithdraw from "./ButtonWithdraw";
interface ButtonWithdrawNativeRewardProps {
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
}

export const ButtonWithdrawNativeReward = (props: ButtonWithdrawNativeRewardProps) => {
  const { contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork();
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    chainId: chain?.id,
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
    <ButtonWithdraw
      contractWriteWithdraw={contractWriteWithdrawNativeReward}
      queryTokenBalance={queryTokenBalance}
      txWithdraw={txWithdrawNative}
    />
  );
};

export default ButtonWithdrawNativeReward;
