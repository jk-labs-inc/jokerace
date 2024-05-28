import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { transform, useDistributeRewardStore } from "@hooks/useDistributeRewards";
import { useError } from "@hooks/useError";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { useAccount, useBalance } from "wagmi";
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
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { chainId } = useAccount();
  const { setIsLoading } = useWithdrawRewardStore(state => state);
  const { setRefetch: triggerDistributeRewardsRefetch } = useDistributeRewardStore(state => state);
  const { handleError } = useError();
  const queryTokenBalance = useBalance({
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
  });

  const handleWithdraw = async () => {
    setIsLoading(true);
    toastLoading(`Withdrawing funds...`);

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "withdrawRewards",
        args: tokenType === "erc20" ? [tokenAddress ?? ""] : [],
      });

      await waitForTransactionReceipt(config, { hash });

      await queryTokenBalance.refetch();
      setIsLoading(false);
      toastSuccess("Funds withdrawn successfully!");
      triggerDistributeRewardsRefetch(true);

      if (!queryTokenBalance.data) return;

      const amountWithdrawnFormatted = transform(queryTokenBalance.data.value, tokenType, queryTokenBalance.data);

      try {
        await updateRewardAnalytics({
          contest_address: contestAddress,
          rewards_module_address: contractRewardsModuleAddress,
          network_name: chainName,
          amount: amountWithdrawnFormatted,
          operation: "withdraw",
          token_address: tokenAddress ? tokenAddress : null,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("error updating reward analytics", error);
      }
    } catch (error: any) {
      handleError(error, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
    }
  };

  return { queryTokenBalance, handleWithdraw };
};
