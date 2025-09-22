import { useContestStore } from "@hooks/useContest/store";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Abi, formatEther, ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

interface CurrentPricePerVoteParams {
  address: string;
  abi: Abi;
  chainId: number;
  enabled?: boolean;
  scopeKey?: string;
  priceCurveUpdateInterval?: number;
  votingClose?: Date;
}

interface CurrentPricePerVoteResponse {
  currentPricePerVote: string;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRefetchError: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<string | undefined, ReadContractErrorType>>;
}

const useCurrentPricePerVote = ({
  address,
  abi,
  chainId,
  enabled = true,
  scopeKey,
  priceCurveUpdateInterval,
  votingClose,
}: CurrentPricePerVoteParams): CurrentPricePerVoteResponse => {
  const { data, refetch, isLoading, isError, isRefetching, isRefetchError } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "currentPricePerVote",
    scopeKey: scopeKey,
    chainId,
    query: {
      enabled: !!address && !!chainId && !!abi && enabled,
      staleTime: query => {
        if (!priceCurveUpdateInterval || !votingClose) return 0;

        const now = Date.now();
        const votingCloseTime = votingClose.getTime();
        const votingTimeLeft = Math.max(0, Math.floor((votingCloseTime - now) / 1000));
        const secondsInCycle = votingTimeLeft % priceCurveUpdateInterval;

        const timeUntilNextUpdate = Math.max(1, priceCurveUpdateInterval - secondsInCycle - 2);

        return timeUntilNextUpdate * 1000;
      },
      select: data => {
        return formatEther(data as bigint);
      },
    },
  });

  return {
    currentPricePerVote: data ?? "0",
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
  };
};

export default useCurrentPricePerVote;
