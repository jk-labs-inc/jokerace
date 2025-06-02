import { Address, Abi } from "viem";
import { useReadContracts } from "wagmi";

interface UsePayoutAddressesParams {
  rewardsModuleAddress: Address;
  abi: Abi;
  chainId: number;
  rankings: number[];
}

interface PayoutAddressesResult {
  addressesByRanking: Record<number, Address>;
  getRankingsForAddress: (address: Address) => number[];
}

export function usePayoutAddresses({ rewardsModuleAddress, abi, chainId, rankings = [] }: UsePayoutAddressesParams) {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: rankings.map(ranking => ({
      address: rewardsModuleAddress,
      abi,
      functionName: "getAddressToPayOut",
      args: [BigInt(ranking)],
      chainId,
    })),
    query: {
      enabled: Boolean(rewardsModuleAddress && abi && chainId && rankings.length > 0),
      select: (results): PayoutAddressesResult => {
        const addressesByRanking: Record<number, Address> = {};

        if (results && Array.isArray(results)) {
          rankings.forEach((ranking, index) => {
            if (index < results.length && results[index]?.result) {
              addressesByRanking[ranking] = results[index].result as Address;
            }
          });
        }

        const getRankingsForAddress = (address: Address): number[] => {
          if (!address) return [];

          return Object.entries(addressesByRanking)
            .filter(([_, payoutAddress]) => payoutAddress?.toLowerCase() === address.toLowerCase())
            .map(([ranking]) => Number(ranking));
        };

        return {
          addressesByRanking,
          getRankingsForAddress,
        };
      },
    },
  });

  return {
    addressesByRanking: data?.addressesByRanking || {},
    getRankingsForAddress: data?.getRankingsForAddress || (() => []),
    isLoading,
    isError,
    refetch,
  };
}
