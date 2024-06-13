import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import useAllRewardsTokens from "@hooks/useRewardsTokens/useAllRewardsTokens";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { create } from "zustand";

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
  abiRewardsModule: Abi,
  tokenAddress: string,
  tokenBalance: string,
) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { setIsLoading } = useWithdrawRewardStore(state => state);
  const { handleError } = useError();
  const { refetchUnpaidTokens } = useUnpaidRewardTokens(
    "rewards-module-unpaid-tokens",
    contractRewardsModuleAddress,
    true,
  );
  const { refetchAllBalances } = useAllRewardsTokens("allRewardsTokens", contractRewardsModuleAddress);

  const handleWithdraw = async () => {
    setIsLoading(true);
    toastLoading(`Withdrawing funds...`);

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "withdrawRewards",
        args: tokenAddress === "native" ? [] : [tokenAddress],
      });

      await waitForTransactionReceipt(config, { hash });

      setIsLoading(false);
      toastSuccess("Funds withdrawn successfully!");

      try {
        await updateRewardAnalytics({
          contest_address: contestAddress,
          rewards_module_address: contractRewardsModuleAddress,
          network_name: chainName,
          amount: Number(tokenBalance),
          operation: "withdraw",
          token_address: tokenAddress === "native" ? null : tokenAddress,
          created_at: Math.floor(Date.now() / 1000),
        });

        refetchUnpaidTokens();
        refetchAllBalances();
      } catch (error) {
        console.error("error updating reward analytics", error);
      }
    } catch (error: any) {
      handleError(error, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
    }
  };

  return { handleWithdraw };
};
