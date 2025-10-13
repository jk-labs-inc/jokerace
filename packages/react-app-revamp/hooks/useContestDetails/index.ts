import { useReadContracts } from "wagmi";
import { Abi } from "viem";
import { useMemo } from "react";
import { ContestStateEnum } from "@hooks/useContestState/store";

interface ContestDetails {
  author: string;
  name: string;
  state: ContestStateEnum;
}

interface UseContestDetailsParams {
  address: `0x${string}`;
  chainId: number;
  abi: Abi;
  enabled?: boolean;
}

interface UseContestDetailsResult {
  contestDetails: ContestDetails | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useContestDetails = ({
  address,
  chainId,
  abi,
  enabled = true,
}: UseContestDetailsParams): UseContestDetailsResult => {
  const contracts = useMemo(
    () => [
      {
        address,
        abi,
        chainId,
        functionName: "creator",
      },
      {
        address,
        abi,
        chainId,
        functionName: "name",
      },
      {
        address,
        abi,
        chainId,
        functionName: "state",
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
        if (!data[0]?.result || !data[1]?.result || data[2]?.result === undefined) {
          return null;
        }

        return {
          author: data[0].result as string,
          name: data[1].result as string,
          state: data[2].result as ContestStateEnum,
        };
      },
    },
  });

  return {
    contestDetails: data ?? null,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
