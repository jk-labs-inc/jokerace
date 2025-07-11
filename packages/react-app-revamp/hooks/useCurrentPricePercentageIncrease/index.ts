import { calculateNextPriceAndIncreaseFromStore } from "@helpers/exponentialMultiplier";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { useMemo } from "react";
import { Abi, formatEther } from "viem";
import { useShallow } from "zustand/react/shallow";

interface CurrentPricePercentageIncreaseParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
  votingClose: Date;
  enabled?: boolean;
}

interface CurrentPricePercentageIncreaseResponse {
  currentPricePercentageData: { percentageIncrease: number; isBelowThreshold: boolean } | null;
  isLoading: boolean;
  isError: boolean;
}

const useCurrentPricePercentageIncrease = ({
  address,
  abi,
  chainId,
  version,
  votingClose,
  enabled = true,
}: CurrentPricePercentageIncreaseParams): CurrentPricePercentageIncreaseResponse => {
  const {
    currentPricePerVote,
    isLoading: isPriceLoading,
    isRefetching: isPriceRefetching,
    isPreloading: isPricePreloading,
    isError: isPriceError,
  } = useCurrentPricePerVoteWithRefetch({
    address,
    abi,
    chainId,
    version,
    votingClose,
    enabled,
  });

  const { costToVote, getTotalVotingMinutes, getCurrentVotingMinute } = useContestStore(
    useShallow(state => ({
      costToVote: state?.charge?.type.costToVote,
      getTotalVotingMinutes: state.getTotalVotingMinutes,
      getCurrentVotingMinute: state.getCurrentVotingMinute,
    })),
  );

  const {
    priceCurveMultiple,
    isLoading: isMultipleLoading,
    isError: isMultipleError,
  } = usePriceCurveMultiple({
    address,
    abi,
    chainId,
    enabled,
  });

  const currentPricePercentageData = useMemo(() => {
    if (!costToVote || !priceCurveMultiple || !currentPricePerVote || isMultipleLoading || isPriceLoading) {
      return null;
    }

    try {
      const currentPriceNumber = Number(currentPricePerVote);
      const multiple = Number(priceCurveMultiple);
      const costToVoteNumber = Number(formatEther(BigInt(costToVote)));

      const { percentageIncrease, isBelowThreshold } = calculateNextPriceAndIncreaseFromStore(
        { getCurrentVotingMinute, getTotalVotingMinutes },
        currentPriceNumber,
        costToVoteNumber,
        multiple,
      );

      return { percentageIncrease, isBelowThreshold };
    } catch (error) {
      return null;
    }
  }, [currentPricePerVote, costToVote, priceCurveMultiple, isMultipleLoading, isPriceLoading]);

  const isLoading = isPriceLoading || isMultipleLoading || isPriceRefetching || isPricePreloading;
  const isError = isPriceError || isMultipleError;

  return {
    currentPricePercentageData,
    isLoading,
    isError,
  };
};

export default useCurrentPricePercentageIncrease;
