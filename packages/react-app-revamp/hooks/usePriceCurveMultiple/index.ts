import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Abi, formatEther, ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";

interface PriceCurveMultipleParams {
  address: string;
  abi: Abi;
  chainId: number;
  enabled?: boolean;
}

interface PriceCurveMultipleResponse {
  priceCurveMultiple: string;
  isLoading: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<string | undefined, ReadContractErrorType>>;
}

const usePriceCurveMultiple = ({
  address,
  abi,
  chainId,
  enabled = true,
}: PriceCurveMultipleParams): PriceCurveMultipleResponse => {
  const {
    data: contractPriceCurveMultiple,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "multiple",
    chainId,
    query: {
      staleTime: Infinity,
      select: data => {
        return formatEther(data as bigint);
      },
      enabled: !!address && !!abi && enabled,
    },
  });

  return {
    priceCurveMultiple: contractPriceCurveMultiple ?? "0",
    isLoading,
    isError,
    refetch,
  };
};

export default usePriceCurveMultiple;
