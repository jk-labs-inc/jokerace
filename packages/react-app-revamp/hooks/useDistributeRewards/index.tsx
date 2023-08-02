import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { utils } from "ethers";
import { CustomError, ErrorCodes } from "types/error";
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
  const { data: tokenData } = tokenType === "erc20" ? useToken({ address: tokenAddress, chainId }) : { data: null };

  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    chainId,
    token: tokenType === "erc20" ? tokenAddress : undefined,
  });

  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId,
    functionName: tokenType === "erc20" ? "releasable(address,uint256)" : "releasable(uint256)",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    //@ts-ignore
    select: data =>
      tokenType === "erc20"
        ? parseFloat(utils.formatUnits(data, tokenData?.decimals))
        : parseFloat(utils.formatEther(data)),
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId,
    functionName: tokenType === "erc20" ? "released(address,uint256)" : "released(uint256)",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    //@ts-ignore

    select: data =>
      tokenType === "erc20"
        ? parseFloat(utils.formatUnits(data, tokenData?.decimals))
        : parseFloat(utils.formatEther(data)),
  });

  const contractWriteReleaseToken = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
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
