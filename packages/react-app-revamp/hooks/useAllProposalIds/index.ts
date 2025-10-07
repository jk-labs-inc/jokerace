import { useReadContract, useReadContracts } from "wagmi";
import { Abi } from "viem";
import { useMemo } from "react";
import { compareVersions } from "compare-versions";
import { formatEther } from "viem";

interface UseAllProposalIdsParams {
  address: `0x${string}`;
  chainId: number;
  abi: Abi;
  version: string;
  enabled?: boolean;
}

interface UseAllProposalIdsResult {
  allProposalIds: string[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Client-side hook to fetch all proposal IDs sorted by votes
 */
export const useAllProposalIds = ({
  address,
  chainId,
  abi,
  version,
  enabled = true,
}: UseAllProposalIdsParams): UseAllProposalIdsResult => {
  const isLegacy = useMemo(() => !version || version.startsWith("3."), [version]);
  const hasDownvotes = useMemo(() => (version ? compareVersions(version, "5.1") < 0 : false), [version]);

  // For legacy contracts, use getAllProposalIds
  const {
    data: legacyData,
    isLoading: legacyLoading,
    isError: legacyError,
    error: legacyErrorObj,
  } = useReadContract({
    address,
    abi,
    chainId,
    functionName: "getAllProposalIds",
    query: {
      enabled: enabled && isLegacy && !!address && !!abi,
      staleTime: Infinity,
      select: (data: any) => {
        const proposalIds = data as bigint[];
        return proposalIds.map(id => id.toString());
      },
    },
  });

  // For non-legacy contracts, use allProposalTotalVotes and getAllDeletedProposalIds
  const nonLegacyContracts = useMemo(
    () => [
      {
        address,
        abi,
        chainId,
        functionName: "allProposalTotalVotes",
      },
      {
        address,
        abi,
        chainId,
        functionName: "getAllDeletedProposalIds",
      },
    ],
    [address, abi, chainId],
  );

  const {
    data: nonLegacyData,
    isLoading: nonLegacyLoading,
    isError: nonLegacyError,
    error: nonLegacyErrorObj,
  } = useReadContracts({
    contracts: nonLegacyContracts,
    query: {
      enabled: enabled && !isLegacy && !!address && !!abi,
      staleTime: Infinity,
      select: data => {
        if (!data[0]?.result) {
          return [];
        }

        const allProposalsResult = data[0].result as any;
        const proposalIds = allProposalsResult[0] as bigint[];
        const voteCounts = allProposalsResult[1];
        const deletedIdsArray = data[1]?.result as bigint[] | undefined;

        // Create set of deleted proposal IDs
        const deletedProposalSet = new Set(deletedIdsArray ? deletedIdsArray.map((id: bigint) => id.toString()) : []);

        // Extract votes helper function
        const extractVotes = (index: number): number => {
          if (hasDownvotes) {
            const forVotes = BigInt(voteCounts[index].forVotes);
            const againstVotes = BigInt(voteCounts[index].againstVotes);
            return Number(formatEther(forVotes - againstVotes));
          }
          return Number(formatEther(voteCounts[index]));
        };

        // Filter out deleted proposals and map to objects with votes
        const mappedProposals = proposalIds
          .map((id, index) => ({
            id: id.toString(),
            votes: extractVotes(index),
          }))
          .filter(p => !deletedProposalSet.has(p.id));

        // Sort by votes (highest first)
        const sortedProposals = mappedProposals.sort((a, b) => b.votes - a.votes);

        return sortedProposals.map(p => p.id);
      },
    },
  });

  if (isLegacy) {
    return {
      allProposalIds: legacyData ?? [],
      isLoading: legacyLoading,
      isError: legacyError,
      error: legacyErrorObj as Error | null,
    };
  }

  return {
    allProposalIds: nonLegacyData ?? [],
    isLoading: nonLegacyLoading,
    isError: nonLegacyError,
    error: nonLegacyErrorObj as Error | null,
  };
};
