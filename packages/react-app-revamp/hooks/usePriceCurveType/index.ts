import { PriceCurveType } from "@hooks/useDeployContest/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Abi, ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";

interface PriceCurveTypeParams {
  address: string;
  abi: Abi;
  chainId: number;
}

interface PriceCurveTypeResponse {
  priceCurveType: PriceCurveType;
  isLoading: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<PriceCurveType | undefined, ReadContractErrorType>>;
}

const usePriceCurveType = ({ address, abi, chainId }: PriceCurveTypeParams): PriceCurveTypeResponse => {
  const {
    data: contractPriceCurveType,
    refetch,
    isLoading,
    isError,
  } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "priceCurveType",
    scopeKey: "priceCurveType",
    chainId,
    query: {
      staleTime: Infinity,
      select: data => {
        if (data === 0n || data === 0) {
          return PriceCurveType.Flat;
        } else if (data === 1n || data === 1) {
          return PriceCurveType.Exponential;
        }
      },
      enabled: !!address && !!abi,
    },
  });

  return {
    priceCurveType: contractPriceCurveType as PriceCurveType,
    refetch,
    isLoading,
    isError,
  };
};

export default usePriceCurveType;
