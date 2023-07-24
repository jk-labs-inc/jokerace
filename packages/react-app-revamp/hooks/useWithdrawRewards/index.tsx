import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { create } from "zustand";

type TokenType = "erc20" | "native";

type Store = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useWithdrawRewardStore = create<Store>(set => ({
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
}));

export const useWithdrawReward = (
  contractRewardsModuleAddress: string,
  abiRewardsModule: any,
  tokenType: TokenType,
  tokenAddress?: string,
) => {
  const { chain } = useNetwork();
  const { setIsLoading } = useWithdrawRewardStore(state => state);

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
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
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
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
      toastError(`something went wrong and the funds couldn't be withdrawn`, customError.message);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      setIsLoading(false);
      toastSuccess("Funds withdrawn successfully !");
    },
  });

  return { queryTokenBalance, contractWriteWithdrawReward, txWithdraw };
};
