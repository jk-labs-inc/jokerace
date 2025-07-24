import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { useError } from "@hooks/useError";
import { compareVersions } from "compare-versions";
import { useEffect } from "react";
import { Abi } from "viem";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface UseCancelRewardsParams {
  rewardsAddress: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

export const REWARDS_CANCELED_VERSION = "4.33";

export function useCancelRewards({ rewardsAddress, abi, chainId, version }: UseCancelRewardsParams) {
  const hasCanceledFunction = compareVersions(version, REWARDS_CANCELED_VERSION) >= 0;
  const { handleError } = useError();

  const {
    data: isCanceled,
    isLoading: isReadLoading,
    isSuccess: isReadSuccess,
    isError: isReadError,
    refetch,
  } = useReadContract({
    address: rewardsAddress,
    abi,
    functionName: "canceled",
    chainId,
    query: {
      enabled: hasCanceledFunction,
    },
  });

  const { writeContract, data: hash, isPending: isWritePending, isError: isWriteError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelRewards = async () => {
    if (!hasCanceledFunction) return;

    toastLoading({
      message: "Cancelling rewards..",
    });

    try {
      writeContract({
        address: rewardsAddress,
        abi,
        functionName: "cancel",
        chainId,
      });
    } catch (error) {
      handleError(error, "error canceling rewards");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toastSuccess({
        message: "Rewards cancelled!",
      });
      refetch();
    }
  }, [isConfirmed, refetch]);

  return {
    isCanceled: hasCanceledFunction ? !!isCanceled : false,
    isLoading: hasCanceledFunction ? isReadLoading : false,
    isSuccess: hasCanceledFunction ? isReadSuccess : true,
    isError: hasCanceledFunction ? isReadError : false,
    refetch,
    cancelRewards,
    isWritePending,
    isWriteError,
    isConfirming,
    isConfirmed,
  };
}
