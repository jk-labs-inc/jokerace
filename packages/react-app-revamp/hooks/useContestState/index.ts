import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ContestStateEnum, useContestStateStore } from "./store";

interface CancelContestResult {
  cancelContest: () => Promise<void>;
  isLoading: boolean;
  isConfirmed: boolean;
}

export function useContestState(): CancelContestResult {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name === chainName)?.id;
  const { contestAbi: abi } = useContestStore(state => state);
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
        chainId,
        abi,
        address: address as `0x${string}`,
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
