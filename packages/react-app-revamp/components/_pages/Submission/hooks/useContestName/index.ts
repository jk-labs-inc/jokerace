import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface UseContestNameProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
}

export const useContestName = ({ contestAddress, contestChainId, contestAbi }: UseContestNameProps) => {
  const {
    data: contestName,
    isLoading,
    isError,
  } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    functionName: "name",
    chainId: contestChainId,
    query: {
      staleTime: Infinity,
    },
  });

  return { contestName: contestName as string, isLoading, isError };
};
