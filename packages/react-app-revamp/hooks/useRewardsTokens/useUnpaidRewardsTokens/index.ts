import { ERC20Token } from "@components/_pages/RewardsDistributionTable/components";
import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import { getTokenDecimalsBatch } from "@helpers/getTokenDecimals";
import { useQuery } from "@tanstack/react-query";
import { getNetBalances } from "lib/rewards";
import { usePathname } from "next/navigation";

export const useUnpaidRewardTokens = (queryKey: string, rewardsModuleAddress: string, includeNative?: boolean) => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;

  const { refetch, data, isLoading, isError } = useQuery({
    queryKey: [queryKey, rewardsModuleAddress],
    queryFn: async () => {
      if (rewardsModuleAddress) {
        const netBalances = await getNetBalances(rewardsModuleAddress, includeNative);

        const tokenAddresses = [...new Set(netBalances.map(token => token.tokenAddress))];
        const tokenDecimals = await getTokenDecimalsBatch(tokenAddresses, chainId);

        const formattedBalances = netBalances.map(
          (token): ERC20Token => ({
            contractAddress: token.tokenAddress,
            tokenBalance: token.balance.toString(),
            decimals: tokenDecimals[token.tokenAddress] || 18,
          }),
        );

        return formattedBalances;
      }
      return [];
    },
    enabled: !!rewardsModuleAddress && !!isSupabaseConfigured,
  });

  return {
    refetchUnpaidTokens: refetch,
    unpaidTokens: data,
    isLoading,
    isError,
  };
};

export default useUnpaidRewardTokens;
