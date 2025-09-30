import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface UseContestAuthorProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
}

export const useContestAuthor = ({ contestAddress, contestChainId, contestAbi }: UseContestAuthorProps) => {
  //TODO: test staleTime
  const {
    data: contestAuthor,
    isLoading,
    isError,
  } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: contestAbi,
    functionName: "creator",
    chainId: contestChainId,
    query: {
      staleTime: Infinity,
    },
  });

  return { contestAuthor: contestAuthor as string, isLoading, isError };
};

export default useContestAuthor;
