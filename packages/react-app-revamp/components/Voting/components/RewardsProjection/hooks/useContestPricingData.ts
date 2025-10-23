import useContestConfigStore from "@hooks/useContestConfig/store";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { useReadContract } from "wagmi";

interface ContestPricingData {
  percentageToCreator: number;
  costToVote: bigint;
  multiple: number;
  isLoading: boolean;
  isError: boolean;
}

export const useContestPricingData = (): ContestPricingData => {
  const { contestConfig } = useContestConfigStore(state => state);

  const {
    data: percentageToCreatorRaw,
    isLoading: isLoadingPercentage,
    isError: isErrorPercentage,
  } = useReadContract({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    functionName: "percentageToCreator",
    chainId: contestConfig.chainId,
    query: {
      enabled: Boolean(contestConfig.address && contestConfig.abi && contestConfig.chainId),
      staleTime: Infinity,
    },
  });

  const {
    data: costToVoteRaw,
    isLoading: isLoadingCost,
    isError: isErrorCost,
  } = useReadContract({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    functionName: "costToVote",
    chainId: contestConfig.chainId,
    query: {
      enabled: Boolean(contestConfig.address && contestConfig.abi && contestConfig.chainId),
      staleTime: Infinity,
    },
  });

  const {
    priceCurveMultiple,
    isLoading: isLoadingMultiple,
    isError: isErrorMultiple,
  } = usePriceCurveMultiple({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    enabled: Boolean(contestConfig.address && contestConfig.abi && contestConfig.chainId),
  });

  return {
    percentageToCreator: percentageToCreatorRaw ? Number(percentageToCreatorRaw) : 0,
    costToVote: (costToVoteRaw as bigint) || 0n,
    multiple: priceCurveMultiple ? Number(priceCurveMultiple) : 0,
    isLoading: isLoadingPercentage || isLoadingCost || isLoadingMultiple,
    isError: isErrorPercentage || isErrorCost || isErrorMultiple,
  };
};
