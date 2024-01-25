import { toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const { chainId } = useAccount();
  const { setIsLoading } = useWithdrawRewardStore(state => state);
  const { handleError } = useError();
  const queryTokenBalance = useBalance({
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
    chainId: chainId,
    address: contractRewardsModuleAddress as `0x${string}`,
  });

  const contractWriteWithdrawReward = async () => {
    try {
      setIsLoading(true);

      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "withdrawRewards",
        args: tokenType === "erc20" ? [tokenAddress ?? ""] : [],
        chainId: chainId,
      });

      setIsLoading(false);
      return hash;
    } catch (e) {
      handleError(e, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
    }
  };

  const txWithdraw = async (hash: string) => {
    try {
      await waitForTransactionReceipt(config, {
        hash: hash as `0x${string}`,
        chainId: chainId,
      });

      await queryTokenBalance.refetch();
      toastSuccess("Funds withdrawn successfully!");

      updateRewardAnalytics({
        contest_address: contestAddress,
        rewards_module_address: contractRewardsModuleAddress,
        network_name: chainName,
        amount: parseFloat(queryTokenBalance.data?.formatted ?? ""),
        operation: "withdraw",
        token_address: tokenAddress ? tokenAddress : null,
        created_at: Math.floor(Date.now() / 1000),
      });
    } catch (e) {
      handleError(e, `something went wrong and the funds couldn't be withdrawn`);
    } finally {
      setIsLoading(false);
    }
  };

  return { queryTokenBalance, contractWriteWithdrawReward, txWithdraw };
};
