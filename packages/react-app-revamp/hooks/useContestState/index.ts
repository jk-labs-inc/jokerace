import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ContestStateEnum, useContestStateStore } from "./store";

interface CancelContestResult {
  cancelContest: () => void;
  isLoading: boolean;
  isConfirmed: boolean;
  error: BaseError | null;
  hash: `0x${string}` | undefined;
}

export function useContestState(): CancelContestResult {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name === chainName)?.id;
  const { contestAbi: abi } = useContestStore(state => state);
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const { setContestState } = useContestStateStore(state => state);

  const cancelContest = () => {
    writeContract({
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "cancel",
    });
  };

  const isLoading = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed && !error) {
      setContestState(ContestStateEnum.Canceled);
    }
  }, [isConfirmed, error, setContestState]);

  return {
    cancelContest,
    isLoading,
    isConfirmed,
    error: error as BaseError | null,
    hash,
  };
}
