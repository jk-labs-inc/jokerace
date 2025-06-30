import { Abi, formatEther } from "viem";
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
  } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "multiple",
    chainId,
    query: {
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
  };
};

export default usePriceCurveMultiple;
