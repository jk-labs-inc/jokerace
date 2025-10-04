import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useState } from "react";
import { ContestStateEnum, useContestStateStore } from "./store";

interface CancelContestResult {
  cancelContest: () => Promise<void>;
  isLoading: boolean;
  isConfirmed: boolean;
}

export function useContestState(): CancelContestResult {
  const { contestConfig } = useContestConfigStore(state => state);
  const { setContestState } = useContestStateStore(state => state);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { handleError } = useError();

  const cancelContest = async (): Promise<void> => {
    setIsLoading(true);
    setIsConfirmed(false);
    toastLoading({
      message: "Cancelling contest...",
    });

    try {
      const { request } = await simulateContract(config, {
        chainId: contestConfig.chainId,
        abi: contestConfig.abi,
        address: contestConfig.address as `0x${string}`,
        functionName: "cancel",
      });

      const txHash = await writeContract(config, request);

      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status === "success") {
        setIsConfirmed(true);
        toastSuccess({
          message: "Contest cancelled successfully",
        });
        setContestState(ContestStateEnum.Canceled);
      }
    } catch (err: any) {
      handleError(err, "An error occurred while cancelling contest");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelContest,
    isLoading,
    isConfirmed,
  };
}
