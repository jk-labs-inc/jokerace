/* eslint-disable react-hooks/exhaustive-deps */
import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { formatEther, formatUnits } from "viem";
import { useBalance, useReadContract, useToken } from "wagmi";
import { create } from "zustand";

type TokenType = "erc20" | "native";

type Store = {
  isLoading: boolean;
  refetch: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setRefetch: (refetch: boolean) => void;
};

export const useDistributeRewardStore = create<Store>(set => ({
  isLoading: false,
  refetch: false,
  setIsLoading: isLoading => set({ isLoading }),
  setRefetch: refetch => set({ refetch }),
}));

export const transform = (amount: bigint, tokenType: string, tokenData: any) => {
  return tokenType === "erc20"
    ? parseFloat(formatUnits(amount, tokenData?.decimals ?? 18))
    : parseFloat(formatEther(amount));
};

export const useDistributeRewards = (
  payee: number,
  share: any,
  contractRewardsModuleAddress: string,
  abiRewardsModule: any,
  chainId: number,
  tokenType: TokenType,
  tokenAddress?: string,
) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { setIsLoading, refetch, setRefetch } = useDistributeRewardStore(state => state);
  const tokenDataRes = useToken({ address: tokenAddress as `0x${string}`, chainId });

  const tokenData = tokenType === "erc20" ? tokenDataRes.data : null;
  const { handleError } = useError();

  useEffect(() => {
    if (refetch) {
      queryRankRewardsReleasable.refetch();
      setRefetch(false);
    }
  }, [refetch, setRefetch]);

  const queryTokenBalance = useBalance({
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
  });

  const queryRankRewardsReleasable = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: "releasable",
    args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
  });

  const queryRankRewardsReleased = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: tokenType === "erc20" ? "erc20Released" : "released",
    args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
  });

  const handleDistributeRewards = async () => {
    setIsLoading(true);
    toastLoading(`Distributing funds...`);
    const amountReleasable = await queryRankRewardsReleasable.refetch();
    const amountReleasableFormatted = transform(amountReleasable.data as bigint, tokenType, tokenData);

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "release",
        args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
        chainId,
      });

      await waitForTransactionReceipt(config, { hash });

      await queryTokenBalance.refetch();
      await queryRankRewardsReleasable.refetch();

      setIsLoading(false);
      toastSuccess("Funds distributed successfully!");

      updateRewardAnalytics({
        contest_address: contestAddress,
        rewards_module_address: contractRewardsModuleAddress,
        network_name: chainName,
        amount: amountReleasableFormatted,
        operation: "distribute",
        token_address: tokenAddress ? tokenAddress : null,
        created_at: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      handleError(error, "Error while releasing token");
      setIsLoading(false);
    }
  };

  return {
    share,
    chainId,
    queryTokenBalance,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    handleDistributeRewards,
  };
};
