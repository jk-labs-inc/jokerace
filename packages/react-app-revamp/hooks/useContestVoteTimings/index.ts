import { useReadContracts } from "wagmi";
import { Abi } from "viem";
import { useMemo } from "react";

interface ContestVoteTimings {
  voteStart: bigint;
  contestDeadline: bigint;
}

interface UseContestVoteTimingsParams {
  address: `0x${string}`;
  chainId: number;
  abi: Abi;
  enabled?: boolean;
}

interface UseContestVoteTimingsResult {
  voteTimings: ContestVoteTimings | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useContestVoteTimings = ({
  address,
  chainId,
  abi,
  enabled = true,
}: UseContestVoteTimingsParams): UseContestVoteTimingsResult => {
  const contracts = useMemo(
    () => [
      {
        address,
        abi,
        chainId,
        functionName: "voteStart",
      },
      {
        address,
        abi,
        chainId,
        functionName: "contestDeadline",
      },
    ],
    [address, abi, chainId],
  );

  const { data, isLoading, isError, error } = useReadContracts({
    contracts,
    query: {
      enabled: enabled && !!address && !!abi,
      staleTime: Infinity,
      select: data => {
        if (!data[0]?.result || !data[1]?.result) {
          return null;
        }

        return {
          voteStart: data[0].result as bigint,
          contestDeadline: data[1].result as bigint,
        };
      },
    },
  });

  return {
    voteTimings: data ?? null,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
