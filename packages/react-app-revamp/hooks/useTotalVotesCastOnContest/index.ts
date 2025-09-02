import { useContestStore } from "@hooks/useContest/store";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";

const useTotalVotesCastOnContest = (address: string, chainId?: number) => {
  const { contestAbi: abi } = useContestStore(state => state);

  const { data, refetch, isLoading, isError } = useReadContract({
    address: address as `0x${string}`,
    abi: abi,
    chainId: chainId,
    functionName: "totalVotesCast",
    query: {
      select: (data: unknown) => {
        const totalVotesCast = formatEther(data as bigint);

        return totalVotesCast;
      },
      enabled: !!abi || !!address || !!chainId,
    },
  });

  return { totalVotesCast: data, refetch, isLoading, isError };
};

export default useTotalVotesCastOnContest;
