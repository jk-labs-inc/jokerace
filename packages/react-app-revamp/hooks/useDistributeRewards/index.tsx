import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { CustomError, ErrorCodes } from "types/error";
import { formatEther, formatUnits } from "viem";
import { useBalance, useContractRead, useContractWrite, useToken, useWaitForTransaction } from "wagmi";
import { create } from "zustand";

type TokenType = "erc20" | "native";

type Store = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useDistributeRewardStore = create<Store>(set => ({
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
}));

export const useDistributeRewards = (
  payee: number,
  share: any,
  contractRewardsModuleAddress: string,
  abiRewardsModule: any,
  chainId: number,
  tokenType: TokenType,
  tokenAddress?: string,
) => {
  const { setIsLoading } = useDistributeRewardStore(state => state);
  const { data: tokenData } =
    tokenType === "erc20" ? useToken({ address: tokenAddress as `0x${string}`, chainId }) : { data: null };

  const queryTokenBalance = useBalance({
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
  });

  const queryRankRewardsReleasable = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: tokenType === "erc20" ? "releasable(address,uint256)" : "releasable(uint256)",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    //@ts-ignore
    select: (data: bigint) => (tokenType === "erc20" ? formatUnits(data, tokenData?.decimals ?? 0) : formatEther(data)),
  });

  const queryRankRewardsReleased = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: tokenType === "erc20" ? "released(address,uint256)" : "released(uint256)",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    select: (data: bigint) => (tokenType === "erc20" ? formatUnits(data, tokenData?.decimals ?? 0) : formatEther(data)),
  });

  const contractWriteReleaseToken = useContractWrite({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    functionName: tokenType === "erc20" ? "release(address,uint256)" : "release(uint256)",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    chainId,
    async onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        setIsLoading(false);
        return;
      }

      toastError(`something went wrong and the the transaction failed`, customError.message);
      setIsLoading(false);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    chainId,
    async onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        setIsLoading(false);
        return;
      }

      toastError(`something went wrong and the the transaction failed`, customError.message);
      setIsLoading(false);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      await queryRankRewardsReleased.refetch();
      await queryRankRewardsReleasable.refetch();
      setIsLoading(false);
      toastSuccess("funds distributed successfully !");
    },
  });

  return {
    share,
    chainId,
    queryTokenBalance,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    contractWriteReleaseToken,
    txRelease,
  };
};
