import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Abi, ReadContractErrorType } from "viem";

interface CurrentPricePerVoteWithRefetchParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
  votingClose: Date;
  enabled?: boolean;
}

interface CurrentPricePerVoteWithRefetchResponse {
  currentPricePerVote: string;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRefetchError: boolean;
  hasPriceChanged: boolean;
  isPreloading: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<string | undefined, ReadContractErrorType>>;
}

//TODO check why initially when voting is open, the price is not updated
const useCurrentPricePerVoteWithRefetch = ({
  address,
  abi,
  chainId,
  version,
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
    version,
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
    version,
    enabled,
    scopeKey: "useCurrentPricePerVoteWithRefetch",
    priceCurveUpdateInterval,
    votingClose,
  });

  const [isPreloading, setIsPreloading] = useState(false);
  const prevPriceRef = useRef<string | null>(null);
  const prevSecondsRef = useRef<number>(0);

  useEffect(() => {
    // Don't run the effect if we don't have the interval yet
    if (!priceCurveUpdateInterval || isIntervalLoading) return;

    const prevSeconds = prevSecondsRef.current;

    if (prevSeconds <= 1 && secondsInCycle >= priceCurveUpdateInterval - 1) {
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

  const hasPriceChanged =
    prevPriceRef.current !== null &&
    prevPriceRef.current !== currentPricePerVote &&
    !isPriceLoading &&
    !isRefetching &&
    !isIntervalLoading;

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
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
    hasPriceChanged,
    isPreloading,
  };
};

export default useCurrentPricePerVoteWithRefetch;
