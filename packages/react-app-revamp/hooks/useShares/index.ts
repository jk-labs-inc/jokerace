import { RankShare } from "lib/rewards/types";
import { Abi, Address } from "viem";
import { useReadContracts } from "wagmi";

interface UseSharesByRankingsParams {
  rewardsModuleAddress: Address;
  abi: Abi;
  chainId: number;
  rankings: number[];
}

export function useSharesByRankings({ rewardsModuleAddress, abi, chainId, rankings = [] }: UseSharesByRankingsParams) {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: rankings.map(ranking => ({
      address: rewardsModuleAddress,
      abi,
      functionName: "shares",
      args: [BigInt(ranking)],
      chainId,
    })),
    query: {
      enabled: Boolean(rewardsModuleAddress && abi && chainId && rankings.length > 0),
      select: (results): RankShare[] => {
        const rankShares: RankShare[] = [];

        if (results && Array.isArray(results)) {
          rankings.forEach((ranking, index) => {
            if (index < results.length && results[index]?.result) {
              rankShares.push({
                rank: ranking,
                share: results[index].result as bigint,
              });
            }
          });
        }

        return rankShares;
      },
    },
  });

  return {
    rankShares: data || [],
    isLoading,
    isError,
    refetch,
  };
}
