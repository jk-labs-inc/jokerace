import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { VOTING_PRICE_CURVES_VERSION } from "constants/versions";
import { Abi, formatEther } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

interface CurrentPricePerVoteParams {
  address: string;
  abi: Abi;
  chainId: number;
  version: string;
  enabled?: boolean;
  scopeKey?: string;
  cacheTime?: number;
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
  scopeKey,
  cacheTime = 0,
}: CurrentPricePerVoteParams): CurrentPricePerVoteResponse => {
  const costToVote = useContestStore(useShallow(state => state.charge?.type.costToVote));
  const isFnSupported = compareVersions(version, VOTING_PRICE_CURVES_VERSION) >= 0;

  const { data, refetch, isLoading, isError, isRefetching, isRefetchError } = useReadContract({
    address: address as `0x${string}`,
    abi,
    functionName: "currentPricePerVote",
    scopeKey: scopeKey,
    chainId,
    query: {
      enabled: !!address && !!chainId && !!abi && enabled && isFnSupported,
      staleTime: cacheTime,
      select: data => {
        return formatEther(data as bigint);
      },
    },
  });

  return {
    currentPricePerVote: isFnSupported ? data ?? "0" : formatEther(BigInt(costToVote ?? 0)),
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
    refetch,
  };
};

export default useCurrentPricePerVote;
