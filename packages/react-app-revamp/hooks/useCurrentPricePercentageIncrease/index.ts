import { calculateStaticMinuteToMinutePercentage } from "@helpers/exponentialMultiplier";
import { useContestStore } from "@hooks/useContest/store";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { useMemo } from "react";
import { Abi, formatEther } from "viem";
import { useShallow } from "zustand/react/shallow";

interface CurrentPricePercentageIncreaseParams {
  address: string;
  abi: Abi;
  chainId: number;
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
  enabled = true,
}: CurrentPricePercentageIncreaseParams): CurrentPricePercentageIncreaseResponse => {
  const { costToVote, getTotalVotingMinutes } = useContestStore(
    useShallow(state => ({
      costToVote: state?.charge?.type.costToVote,
      getTotalVotingMinutes: state.getTotalVotingMinutes,
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
    if (!costToVote || !priceCurveMultiple || isMultipleLoading) {
      return null;
    }

    try {
      const multiple = Number(priceCurveMultiple);
      const costToVoteNumber = Number(formatEther(BigInt(costToVote)));
      const totalMinutes = getTotalVotingMinutes();

      const { percentageIncrease, isBelowThreshold } = calculateStaticMinuteToMinutePercentage(
        costToVoteNumber,
        multiple,
        totalMinutes,
      );

      return { percentageIncrease, isBelowThreshold };
    } catch (error) {
      return null;
    }
  }, [costToVote, priceCurveMultiple, isMultipleLoading, getTotalVotingMinutes]);

  const isLoading = isMultipleLoading;
  const isError = isMultipleError;

  return {
    currentPricePercentageData,
    isLoading,
    isError,
  };
};

export default useCurrentPricePercentageIncrease;
