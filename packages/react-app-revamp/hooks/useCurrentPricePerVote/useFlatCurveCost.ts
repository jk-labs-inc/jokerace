import { Abi, formatEther } from "viem";
import { useReadContract } from "wagmi";

interface UseFlatCurveCostProps {
  address: string;
  abi: Abi;
  chainId: number;
  enabled?: boolean;
}

interface UseFlatCurveCostReturn {
  costToVote: string;
  costToVoteRaw: bigint;
  isLoading: boolean;
  isError: boolean;
}

export const useFlatCurveCost = ({
  address,
  abi,
  chainId,
  enabled = true,
}: UseFlatCurveCostProps): UseFlatCurveCostReturn => {
  const { data, isLoading, isError } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "costToVote",
    chainId,
    query: {
      enabled: enabled && !!address && !!abi,
      staleTime: Infinity,
    },
  });

  const costToVoteRaw = (data as bigint) || 0n;
  const costToVote = data ? formatEther(data as bigint) : "0";

  return {
    costToVote,
    costToVoteRaw,
    isLoading,
    isError,
  };
};
