import { formatBalance } from "@helpers/formatBalance";
import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Abi, ReadContractErrorType } from "viem";

interface CurrentPricePerVoteWithRefetchParams {
  address: string;
  abi: Abi;
  chainId: number;
  votingClose: Date;
  enabled?: boolean;
}

interface CurrentPricePerVoteWithRefetchResponse {
  currentPricePerVote: string;
  currentPricePerVoteFormatted: string;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRefetchError: boolean;
  isPreloading: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<string | undefined, ReadContractErrorType>>;
}

const useCurrentPricePerVoteWithRefetch = ({
  address,
  abi,
  chainId,
  votingClose,
  enabled = true,
}: CurrentPricePerVoteWithRefetchParams): CurrentPricePerVoteWithRefetchResponse => {
  const {
    priceCurveUpdateInterval,
    isLoading: isIntervalLoading,
    isError: isIntervalError,
  } = usePriceCurveUpdateInterval({
    address,
    abi,
    chainId,
    enabled,
  });

  const now = Date.now();
  const votingCloseTime = votingClose.getTime();
  const votingTimeLeft = Math.max(0, Math.floor((votingCloseTime - now) / 1000));
  const secondsInCycle = priceCurveUpdateInterval ? votingTimeLeft % priceCurveUpdateInterval : 0;

  const {
    currentPricePerVote,
    isLoading: isPriceLoading,
    isRefetching,
    isError: isPriceError,
    isRefetchError,
    refetch,
  } = useCurrentPricePerVote({
    address,
    abi,
    chainId,
    enabled,
    scopeKey: "useCurrentPricePerVoteWithRefetch",
    priceCurveUpdateInterval,
    votingClose,
  });

  const [isPreloading, setIsPreloading] = useState(false);
  const prevPriceRef = useRef<string | null>(null);
  const prevSecondsRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't run the effect if we don't have the interval yet
    if (!priceCurveUpdateInterval || isIntervalLoading) return;

    const prevSeconds = prevSecondsRef.current;

    // Only run preloading logic if we have a previous value to compare against (issue here is that price won't load initially)
    if (prevSeconds !== null && prevSeconds <= 1 && secondsInCycle >= priceCurveUpdateInterval - 1) {
      setIsPreloading(true);

      setTimeout(() => {
        refetch();
      }, 1000);
    }

    prevSecondsRef.current = secondsInCycle;
  }, [secondsInCycle, priceCurveUpdateInterval, refetch, isIntervalLoading, votingTimeLeft]);

  useEffect(() => {
    if (isRefetching) {
      setIsPreloading(false);
    }
  }, [isRefetching]);

  useEffect(() => {
    if (!isPriceLoading && !isRefetching && !isIntervalLoading && currentPricePerVote) {
      prevPriceRef.current = currentPricePerVote;
    }
  }, [currentPricePerVote, isPriceLoading, isRefetching, isIntervalLoading]);

  // Combine loading states - we're loading if either interval or price is loading
  const isLoading = isIntervalLoading || isPriceLoading;

  // Combine error states - we have an error if either interval or price has an error
  const isError = isIntervalError || isPriceError;

  return {
    currentPricePerVote,
    currentPricePerVoteFormatted: formatBalance(currentPricePerVote),
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
    isPreloading,
  };
};

export default useCurrentPricePerVoteWithRefetch;
