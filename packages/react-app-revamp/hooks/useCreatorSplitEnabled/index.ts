import { CREATOR_SPLIT_VERSION } from "@hooks/useContest/v3v4/contracts";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface UseCreatorSplitEnabledParams {
  address: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

interface UseCreatorSplitEnabledResult {
  creatorSplitEnabled: number;
  isLoading: boolean;
  isError: boolean;
}

export const useCreatorSplitEnabled = ({
  address,
  abi,
  chainId,
  version,
}: UseCreatorSplitEnabledParams): UseCreatorSplitEnabledResult => {
  const hasCreatorSplit = compareVersions(version, CREATOR_SPLIT_VERSION) >= 0;

  const { data, isLoading, isError } = useReadContract({
    address,
    abi,
    chainId,
    functionName: "creatorSplitEnabled",
    query: {
      enabled: hasCreatorSplit,
      staleTime: Infinity,
      select: data => Number(data) || 0,
    },
  });

  return {
    creatorSplitEnabled: hasCreatorSplit ? data ?? 0 : 0,
    isLoading: hasCreatorSplit ? isLoading : false,
    isError: hasCreatorSplit ? isError : false,
  };
};

export default useCreatorSplitEnabled;
