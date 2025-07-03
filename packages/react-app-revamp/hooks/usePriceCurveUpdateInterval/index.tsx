import { PriceCurveType } from "@hooks/useDeployContest/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Abi, ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";

interface PriceCurveUpdateIntervalParams {
  address: string;
  abi: Abi;
  chainId: number;
  enabled?: boolean;
}

interface PriceCurveUpdateIntervalResponse {
  priceCurveUpdateInterval: number;
  isLoading: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<number | undefined, ReadContractErrorType>>;
}

const usePriceCurveUpdateInterval = ({
  address,
  abi,
  chainId,
  enabled = true,
}: PriceCurveUpdateIntervalParams): PriceCurveUpdateIntervalResponse => {
  const {
    data: contractPriceCurveUpdateInterval,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "PRICE_CURVE_UPDATE_INTERVAL",
    scopeKey: "priceCurveUpdateInterval",
    chainId,
    query: {
      staleTime: Infinity,
      select: data => {
        return Number(data);
      },
      enabled: !!address && !!abi && enabled,
    },
  });

  return {
    priceCurveUpdateInterval: contractPriceCurveUpdateInterval as number,
    isLoading,
    isError,
    refetch,
  };
};

export default usePriceCurveUpdateInterval;
