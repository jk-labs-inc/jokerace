import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import ButtonWithdraw from "./ButtonWithdraw";
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
    chainId: chain?.id,
    addressOrName: contractRewardsModuleAddress,
  });
  const contractWriteWithdrawERC20Reward = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "withdrawRewards(address)",
    chainId: chain?.id,
    args: [tokenAddress],
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

  const txWithdrawERC20 = useWaitForTransaction({
    hash: contractWriteWithdrawERC20Reward?.data?.hash,
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }
      toastError(`Something went wrong and the funds couldn't be withdrawn  :", ${customError.message}`);
    },
    onSuccess(data) {
      toastSuccess("Funds withdrawn successfully !");
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
