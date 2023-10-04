import { toastSuccess } from "@components/UI/Toast";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const { setIsLoading } = useDistributeRewardStore(state => state);
  const tokenDataRes = useToken({ address: tokenAddress as `0x${string}`, chainId });
  const tokenData = tokenType === "erc20" ? tokenDataRes.data : null;
  const { handleError } = useError();

  const transform = (data: unknown[]) => {
    const amount = data as unknown as bigint;

    return tokenType === "erc20"
      ? parseFloat(formatUnits(amount, tokenData?.decimals ?? 18))
      : parseFloat(formatEther(amount));
  };

  const queryTokenBalance = useBalance({
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
  });

  const queryRankRewardsReleasable = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: "releasable",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    select: data => transform(data),
    async onError(e) {},
  });

  const queryRankRewardsReleased = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: "released",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    select: data => transform(data),
  });

  const contractWriteReleaseToken = useContractWrite({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    functionName: "release",
    args: tokenType === "erc20" ? [tokenAddress, payee] : [payee],
    chainId,
    async onError(e) {
      handleError(e, "something went wrong and the the transaction failed");
      setIsLoading(false);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    chainId,
    async onError(e) {
      handleError(e, "something went wrong and the the transaction failed");
      setIsLoading(false);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      await queryRankRewardsReleasable.refetch();
      const amountReleased = await queryRankRewardsReleased.refetch();

      setIsLoading(false);
      toastSuccess("funds distributed successfully !");

      updateRewardAnalytics({
        contest_address: contestAddress,
        rewards_module_address: contractRewardsModuleAddress,
        network_name: chainName,
        amount: amountReleased.data ?? 0,
        operation: "distribute",
        token_address: tokenAddress ? tokenAddress : null,
        created_at: Math.floor(Date.now() / 1000),
      });
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
