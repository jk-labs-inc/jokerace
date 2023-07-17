import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";

type TokenType = "erc20" | "native";

export const useWithdrawReward = (
  contractRewardsModuleAddress: string,
  abiRewardsModule: any,
  tokenType: TokenType,
  tokenAddress?: string,
) => {
  const { chain } = useNetwork();

  const queryTokenBalance = useBalance({
    token: tokenType === "erc20" ? tokenAddress : undefined,
    chainId: chain?.id,
    addressOrName: contractRewardsModuleAddress,
  });

  const contractWriteWithdrawReward = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: tokenType === "erc20" ? "withdrawRewards(address)" : "withdrawRewards()",
    chainId: chain?.id,
    args: tokenType === "erc20" ? [tokenAddress] : [],
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }
      toastError(`something went wrong and the funds couldn't be withdrawn`, customError.message);
    },
  });

  const txWithdraw = useWaitForTransaction({
    hash: contractWriteWithdrawReward?.data?.hash,
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }
      toastError(`something went wrong and the funds couldn't be withdrawn`, customError.message);
    },
    onSuccess() {
      toastSuccess("Funds withdrawn successfully !");
    },
  });

  return { queryTokenBalance, contractWriteWithdrawReward, txWithdraw };
};
