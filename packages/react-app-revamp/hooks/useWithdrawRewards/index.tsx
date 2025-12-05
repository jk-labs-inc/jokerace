import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { transform } from "@helpers/transform";
import { useError } from "@hooks/useError";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Abi } from "viem";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";

export const useWithdrawReward = (
  contractRewardsModuleAddress: string,
  abiRewardsModule: Abi,
  tokenAddress: string,
  tokenBalance: bigint,
  tokenDecimals: number,
  onWithdrawStart?: () => void,
  onWithdrawSuccess?: () => void,
  onWithdrawError?: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { chainName, address: contestAddress } = useContestConfigStore(useShallow(state => state.contestConfig));
  const { handleError } = useError();

  const handleWithdraw = async () => {
    setIsLoading(true);
    onWithdrawStart?.();
    toastLoading({
      message: "Withdrawing funds...",
      additionalMessageType: LoadingToastMessageType.KEEP_BROWSER_OPEN,
    });

    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "withdrawRewards",
        args: tokenAddress === "native" ? [] : [tokenAddress],
      });

      await waitForTransactionReceipt(config, { hash, confirmations: 2 });

      setIsLoading(false);
      onWithdrawSuccess?.();
      toastSuccess({
        message: "Funds withdrawn successfully!",
      });

      try {
        await updateRewardAnalytics({
          contest_address: contestAddress,
          rewards_module_address: contractRewardsModuleAddress,
          network_name: chainName,
          amount: transform(tokenBalance, tokenAddress, tokenDecimals),
          operation: "withdraw",
          token_address: tokenAddress === "native" ? null : tokenAddress,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("error updating reward analytics", error);
      }
    } catch (error: any) {
      handleError(error, `something went wrong and the funds couldn't be withdrawn`);
      setIsLoading(false);
      onWithdrawError?.();
    }
  };

  return { handleWithdraw, isLoading };
};
