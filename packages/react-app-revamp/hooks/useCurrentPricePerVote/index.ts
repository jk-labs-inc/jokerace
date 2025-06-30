import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { Abi, formatEther } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

interface CurrentPricePerVoteParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
  enabled?: boolean;
}

interface CurrentPricePerVoteResponse {
  currentPricePerVote: string;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRefetchError: boolean;
  refetch: () => void;
}

const useCurrentPricePerVote = ({
  address,
  abi,
  chainId,
  version,
  enabled = true,
}: CurrentPricePerVoteParams): CurrentPricePerVoteResponse => {
  const costToVote = useContestStore(useShallow(state => state.charge?.type.costToVote));
  const isFnSupported = compareVersions(version, "5.7") >= 0;

  const { data, refetch, isLoading, isError, isRefetching, isRefetchError } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "currentPricePerVote",
    scopeKey: "currentPricePerVote",
    chainId,
    query: {
      enabled: !!address && !!chainId && !!abi && enabled && isFnSupported,
      staleTime: 0,
      select: data => {
        return formatEther(data as bigint);
      },
    },
  });

  return {
    currentPricePerVote: isFnSupported ? data ?? "0" : costToVote?.toString() ?? "0",
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
  };
};

export default useCurrentPricePerVote;
