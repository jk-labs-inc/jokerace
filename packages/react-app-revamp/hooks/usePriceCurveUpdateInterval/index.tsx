import { PriceCurveType } from "@hooks/useDeployContest/types";
import { Abi } from "viem";
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
}

const usePriceCurveUpdateInterval = ({ address, abi, chainId, enabled = true }: PriceCurveUpdateIntervalParams): PriceCurveUpdateIntervalResponse => {
  const {
    data: contractPriceCurveUpdateInterval,
    isLoading,
    isError,
  } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "PRICE_CURVE_UPDATE_INTERVAL",
    chainId,
    query: {
      select: data => {
        return Number(data)
      },
      enabled: !!address && !!abi && enabled,
    },
  });

  return {
    priceCurveUpdateInterval: contractPriceCurveUpdateInterval as number,
    isLoading,
    isError,
  };
};

export default usePriceCurveUpdateInterval;
