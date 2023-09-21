import { toastSuccess } from "@components/UI/Toast";
import { useError } from "@hooks/useError";
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
  const { handleError } = useError();

  const queryTokenBalance = useBalance({
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
    chainId: chain?.id,
    address: contractRewardsModuleAddress as `0x${string}`,
  });

  const contractWriteWithdrawReward = useContractWrite({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    functionName: "withdrawRewards",
    chainId: chain?.id,
    args: tokenType === "erc20" ? [tokenAddress] : [],
    onError(e) {
      handleError(e, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
    },
  });

  const txWithdraw = useWaitForTransaction({
    hash: contractWriteWithdrawReward?.data?.hash,
    onError(e) {
      handleError(e, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      setIsLoading(false);
      toastSuccess("Funds withdrawn successfully !");
    },
  });

  return { queryTokenBalance, contractWriteWithdrawReward, txWithdraw };
};
