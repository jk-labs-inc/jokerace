import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { transform } from "@hooks/useDistributeRewards";
import { useError } from "@hooks/useError";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { ModuleType } from "lib/rewards";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { create } from "zustand";

type LoadingState = Record<number, boolean>;
type SuccessState = Record<number, boolean>;

type Store = {
  loadingStates: LoadingState;
  successStates: SuccessState;
  setLoading: (payee: number, isLoading: boolean) => void;
  setSuccess: (payee: number, isSuccess: boolean) => void;
  resetStates: () => void;
};

export const useClaimRewardsStore = create<Store>(set => ({
  loadingStates: {},
  successStates: {},
  setLoading: (payee, isLoading) =>
    set(state => ({
      loadingStates: { ...state.loadingStates, [payee]: isLoading },
    })),
  setSuccess: (payee, isSuccess) =>
    set(state => ({
      successStates: { ...state.successStates, [payee]: isSuccess },
    })),
  resetStates: () => set({ loadingStates: {}, successStates: {} }),
}));

interface UseClaimRewardsProps {
  contractRewardsModuleAddress: `0x${string}`;
  abiRewardsModule: Abi;
  chainId: number;
  tokenAddress: string;
  tokenDecimals: number;
  moduleType: ModuleType;
}

export const useClaimRewards = ({
  contractRewardsModuleAddress,
  abiRewardsModule,
  chainId,
  tokenAddress,
  tokenDecimals,
  moduleType,
}: UseClaimRewardsProps) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { handleError } = useError();
  const { loadingStates, successStates, setLoading, setSuccess } = useClaimRewardsStore();

  const claimRewards = async (payee: number, tokenBalance: bigint, voterAddress?: `0x${string}`) => {
    setLoading(payee, true);
    setSuccess(payee, false);
    toastLoading(`Claiming rewards...`, LoadingToastMessageType.KEEP_BROWSER_OPEN);
    const amountReleasableFormatted = transform(tokenBalance, tokenAddress, tokenDecimals);

    try {
      const args =
        moduleType === ModuleType.AUTHOR_REWARDS
          ? tokenAddress === "native"
            ? [payee]
            : [tokenAddress, payee]
          : tokenAddress === "native"
            ? [voterAddress, payee]
            : [tokenAddress, voterAddress, payee];

      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress,
        abi: abiRewardsModule,
        functionName: "release",
        args,
        chainId,
      });

      await waitForTransactionReceipt(config, { hash });

      setLoading(payee, false);
      setSuccess(payee, true);
      toastSuccess("Rewards claimed successfully!");

      try {
        await updateRewardAnalytics({
          contest_address: contestAddress,
          rewards_module_address: contractRewardsModuleAddress,
          network_name: chainName,
          amount: amountReleasableFormatted,
          operation: "distribute",
          token_address: tokenAddress === "native" ? null : tokenAddress,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
    } catch (error) {
      handleError(error, "Error while claiming rewards");
      setLoading(payee, false);
    }
  };

  const isLoading = (payee: number) => loadingStates[payee] || false;
  const isSuccess = (payee: number) => successStates[payee] || false;

  return {
    claimRewards,
    isLoading,
    isSuccess,
  };
};
