import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import { useEffect, useRef } from "react";
import { Abi } from "viem";

interface CurrentPricePerVoteWithRefetchParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
  votingClose: Date;
  priceCurveUpdateInterval: number;
  enabled?: boolean;
}

interface CurrentPricePerVoteWithRefetchResponse {
  currentPricePerVote: string;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRefetchError: boolean;
  refetch: () => void;
  hasPriceChanged: boolean;
}

const useCurrentPricePerVoteWithRefetch = ({
  address,
  abi,
  chainId,
  version,
  votingClose,
  priceCurveUpdateInterval,
  enabled = true,
}: CurrentPricePerVoteWithRefetchParams): CurrentPricePerVoteWithRefetchResponse => {
  const { currentPricePerVote, isLoading, isRefetching, isError, isRefetchError, refetch } = useCurrentPricePerVote({
    address,
    abi,
    chainId,
    version,
    enabled,
  });

  const now = Date.now();
  const votingCloseTime = votingClose.getTime();
  const votingTimeLeft = Math.max(0, Math.floor((votingCloseTime - now) / 1000));

  const prevPriceRef = useRef<string | null>(null);
  const prevSecondsRef = useRef<number>(votingTimeLeft % priceCurveUpdateInterval);
  const secondsInCycle = votingTimeLeft % priceCurveUpdateInterval;

  useEffect(() => {
    const prevSeconds = prevSecondsRef.current;

    if (prevSeconds <= 1 && secondsInCycle >= priceCurveUpdateInterval - 1) {
      setTimeout(() => {
        refetch();
      }, 1000);
    }

    prevSecondsRef.current = secondsInCycle;
  }, [secondsInCycle, priceCurveUpdateInterval, refetch]);

  const hasPriceChanged =
    prevPriceRef.current !== null && prevPriceRef.current !== currentPricePerVote && !isLoading && !isRefetching;

  useEffect(() => {
    if (!isLoading && !isRefetching && currentPricePerVote) {
      prevPriceRef.current = currentPricePerVote;
    }
  }, [currentPricePerVote, isLoading, isRefetching]);

  return {
    currentPricePerVote,
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
    hasPriceChanged,
  };
};

export default useCurrentPricePerVoteWithRefetch;
