import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { transform } from "@helpers/transform";
import { useError } from "@hooks/useError";
import { switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { ModuleType } from "lib/rewards/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";

interface UseClaimRewardsProps {
  contractRewardsModuleAddress: `0x${string}`;
  abiRewardsModule: Abi;
  chainId: number;
  tokenAddress: string;
  tokenDecimals: number;
  moduleType: ModuleType;
  userAddress?: `0x${string}`;
}

type ClaimKey = string;
type ClaimState = Record<ClaimKey, boolean>;

export const useClaimRewards = ({
  contractRewardsModuleAddress,
  abiRewardsModule,
  chainId,
  tokenAddress,
  tokenDecimals,
  moduleType,
  userAddress,
}: UseClaimRewardsProps) => {
  const { chainId: userChainId } = useAccount();
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { handleError } = useError();
  const [loadingStates, setLoadingStates] = useState<ClaimState>({});
  const [successStates, setSuccessStates] = useState<ClaimState>({});

  const setLoading = (payee: number, tokenAddress: string, isLoading: boolean) => {
    const key = `${userAddress}-${payee}-${tokenAddress}`;
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  };

  const setSuccess = (payee: number, tokenAddress: string, isSuccess: boolean) => {
    const key = `${userAddress}-${payee}-${tokenAddress}`;
    setSuccessStates(prev => ({ ...prev, [key]: isSuccess }));
  };

  const claimRewards = async (
    payee: number,
    tokenBalance: bigint,
    tokenAddress: string,
    voterAddress?: `0x${string}`,
  ) => {
    setLoading(payee, tokenAddress, true);
    setSuccess(payee, tokenAddress, false);
    toastLoading(`Claiming rewards...`, LoadingToastMessageType.KEEP_BROWSER_OPEN);
    const amountReleasableFormatted = transform(tokenBalance, tokenAddress, tokenDecimals);

    if (userChainId && userChainId !== chainId) {
      await switchChain(config, { chainId });
    }

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

      setLoading(payee, tokenAddress, false);
      setSuccess(payee, tokenAddress, true);
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
      setLoading(payee, tokenAddress, false);
    }
  };

  const isLoading = (payee: number, tokenAddress: string) =>
    loadingStates[`${userAddress}-${payee}-${tokenAddress}`] || false;
  const isSuccess = (payee: number, tokenAddress: string) =>
    successStates[`${userAddress}-${payee}-${tokenAddress}`] || false;

  return {
    claimRewards,
    isLoading,
    isSuccess,
  };
};
