import { PriceCurveType } from "@hooks/useDeployContest/types";
import { Abi } from "viem";
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
}

const usePriceCurveType = ({ address, abi, chainId }: PriceCurveTypeParams): PriceCurveTypeResponse => {
  const { data: contractPriceCurveType, isLoading, isError } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: 'priceCurveType',
    scopeKey: 'priceCurveType',
    chainId,
    query: {
      select: (data) => {
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
    isLoading,
    isError,
   }
};

export default usePriceCurveType;