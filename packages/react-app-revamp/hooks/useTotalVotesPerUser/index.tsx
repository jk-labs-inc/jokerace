import { useContestStore } from "@hooks/useContest/store";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

interface UseTotalVotesPerUserParams {
  contractAddress: `0x${string}`;
  chainId: number;
  userAddress?: `0x${string}`;
}

const useTotalVotesPerUser = ({ contractAddress, chainId, userAddress }: UseTotalVotesPerUserParams) => {
  const { contestAbi: abi } = useContestStore(state => state);

  const result = useReadContract({
    address: contractAddress,
    abi,
    chainId,
    functionName: "addressTotalCastVoteCount",
    args: [userAddress],
    query: {
      select: (data: unknown) => {
        const formattedVotes = Number(formatUnits(data as bigint, 0));
        return {
          totalVotes: formattedVotes,
          hasVoted: formattedVotes > 0,
        };
      },
      enabled: !!abi && !!contractAddress && !!userAddress && !!chainId,
    },
  });

  return {
    ...result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    retry: result.refetch,
  };
};

export default useTotalVotesPerUser;
