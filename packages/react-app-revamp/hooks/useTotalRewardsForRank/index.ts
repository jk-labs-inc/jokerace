import { useQuery } from "@tanstack/react-query";
import { fetchTotalRewardsForRank } from "lib/rewards/contracts";
import { Abi, Address } from "viem";

interface UseTotalRewardsParams {
  rewardsModuleAddress: Address;
  rewardsModuleAbi: Abi;
  chainId: number;
  ranking: number;
  enabled?: boolean;
}

export function useTotalRewardsForRank({
  rewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  ranking,
  enabled = true,
}: UseTotalRewardsParams) {
  return useQuery({
    queryKey: ["totalRewardsForRank", rewardsModuleAddress, chainId, ranking],
    queryFn: async () => {
      if (!rewardsModuleAddress || !rewardsModuleAbi || !chainId) {
        throw new Error("Missing required parameters");
      }

      return await fetchTotalRewardsForRank({
        rewardsModuleAddress,
        rewardsModuleAbi,
        chainId,
        ranking,
      });
    },
    enabled: enabled && !!rewardsModuleAddress && !!rewardsModuleAbi && !!chainId && !!ranking,
  });
}
