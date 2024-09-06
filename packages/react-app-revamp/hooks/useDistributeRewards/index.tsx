import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { Abi, formatEther, formatUnits } from "viem";
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
  tokenBalance: bigint,
  tokenDecimals: number,
) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const rewardsStore = useRewardsStore(state => state);
  const { setIsLoading } = useDistributeRewardStore(state => state);
  const { handleError } = useError();
  const { refetch: refetchReleasableRewards } = useReleasableRewards({
    contractAddress: contractRewardsModuleAddress,
    chainId,
    abi: abiRewardsModule,
    rankings: rewardsStore.rewards.payees,
  });
  const { refetch: refetchReleasedRewards } = useReleasedRewards({
    contractAddress: contractRewardsModuleAddress,
    chainId,
    abi: abiRewardsModule,
    rankings: rewardsStore.rewards.payees,
  });

  const handleDistributeRewards = async () => {
    setIsLoading(true);
    toastLoading(`Distributing funds...`);
    const amountReleasableFormatted = transform(tokenBalance, tokenAddress, tokenDecimals);

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "release",
        args: tokenAddress === "native" ? [payee] : [tokenAddress ?? "", payee],
        chainId,
      });

      await waitForTransactionReceipt(config, { hash });

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
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
      refetchReleasableRewards();
      refetchReleasedRewards();
    } catch (error) {
      handleError(error, "Error while releasing token");
      setIsLoading(false);
    }
  };

  return {
    share,
    chainId,
    handleDistributeRewards,
  };
};
