import { PriceCurveType } from "@hooks/useDeployContest/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { Abi, ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";

interface PriceCurveUpdateIntervalParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
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
  version,
  enabled = true,
}: PriceCurveUpdateIntervalParams): PriceCurveUpdateIntervalResponse => {
  const isFnSupported = compareVersions(version, VOTING_PRICE_CURVES_VERSION) >= 0;

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
      enabled: !!address && !!abi && enabled && isFnSupported,
    },
  });

  return {
    priceCurveUpdateInterval: contractPriceCurveUpdateInterval as number,
    isLoading: isFnSupported ? isLoading : false,
    isError: isFnSupported ? isError : false,
    refetch,
  };
};

export default usePriceCurveUpdateInterval;
