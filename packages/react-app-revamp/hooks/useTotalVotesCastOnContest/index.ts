import useContestConfigStore from "@hooks/useContestConfig/store";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

const useTotalVotesCastOnContest = (address: string, chainId?: number) => {
  const abi = useContestConfigStore(useShallow(state => state.contestConfig.abi));

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
