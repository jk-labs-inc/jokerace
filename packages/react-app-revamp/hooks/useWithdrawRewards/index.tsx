import { toastSuccess } from "@components/UI/Toast";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
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

      updateRewardAnalytics({
        contest_address: contestAddress,
        rewards_module_address: contractRewardsModuleAddress,
        network_name: chainName,
        amount: parseFloat(queryTokenBalance.data?.formatted ?? ""),
        operation: "withdraw",
        token_address: tokenAddress ? tokenAddress : null,
        created_at: Math.floor(Date.now() / 1000),
      });
    },
  });

  return { queryTokenBalance, contractWriteWithdrawReward, txWithdraw };
};
