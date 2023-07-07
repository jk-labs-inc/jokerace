import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
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
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }

      toastError(e.message);
    },
  });

  const txWithdrawNative = useWaitForTransaction({
    hash: contractWriteWithdrawNativeReward?.data?.hash,
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }
      toastError(`Something went wrong and the funds couldn't be withdrawn  :", ${customError.message}`);
    },
    onSuccess() {
      toastSuccess("Funds withdrawn successfully !");
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
