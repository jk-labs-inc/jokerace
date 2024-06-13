/* eslint-disable react-hooks/exhaustive-deps */
import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import usePaidRewardTokens from "@hooks/useRewardsTokens/usePaidRewardsTokens";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { Abi, formatEther, formatUnits } from "viem";
import { useBalance, useReadContract } from "wagmi";
import { create } from "zustand";

type Store = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useDistributeRewardStore = create<Store>(set => ({
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
}));

export const transform = (amount: bigint, tokenAddress: string, tokenDecimals: number) => {
  return tokenAddress === "native" ? parseFloat(formatEther(amount)) : parseFloat(formatUnits(amount, tokenDecimals));
};

export const useDistributeRewards = (
  payee: number,
  share: any,
  contractRewardsModuleAddress: string,
  abiRewardsModule: Abi,
  chainId: number,
  tokenAddress: string,
  tokenDecimals: number,
) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { setIsLoading } = useDistributeRewardStore(state => state);
  const { refetchUnpaidTokens } = useUnpaidRewardTokens(
    "rewards-module-unpaid-tokens",
    contractRewardsModuleAddress,
    true,
  );
  const { refetchPaidTokens } = usePaidRewardTokens("rewards-info-paid-tokens", contractRewardsModuleAddress, true);

  const { handleError } = useError();

  const queryTokenBalance = useBalance({
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
    token: tokenAddress === "native" ? undefined : (tokenAddress as `0x${string}`),
  });

  const queryRankRewardsReleasable = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: "releasable",
    args: tokenAddress === "native" ? [payee] : [tokenAddress ?? "", payee],
  });

  const queryRankRewardsReleased = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: tokenAddress === "native" ? "released" : "erc20Released",
    args: tokenAddress === "native" ? [payee] : [tokenAddress ?? "", payee],
  });

  const handleRefetchBalances = () => {
    refetchUnpaidTokens();
    refetchPaidTokens();
  };

  const handleDistributeRewards = async () => {
    setIsLoading(true);
    toastLoading(`Distributing funds...`);
    const amountReleasable = await queryRankRewardsReleasable.refetch();
    const amountReleasableFormatted = transform(amountReleasable.data as bigint, tokenAddress, tokenDecimals);

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "release",
        args: tokenAddress === "native" ? [payee] : [tokenAddress ?? "", payee],
        chainId,
      });

      await waitForTransactionReceipt(config, { hash });

      await queryTokenBalance.refetch();
      await queryRankRewardsReleasable.refetch();

      setIsLoading(false);
      toastSuccess("Funds distributed successfully!");

      try {
        await updateRewardAnalytics({
          contest_address: contestAddress,
          rewards_module_address: contractRewardsModuleAddress,
          network_name: chainName,
          amount: amountReleasableFormatted,
          operation: "distribute",
          token_address: tokenAddress ? tokenAddress : null,
          created_at: Math.floor(Date.now() / 1000),
        });

        handleRefetchBalances();
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
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
