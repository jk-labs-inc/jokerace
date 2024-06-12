import { ERC20Token } from "@components/_pages/RewardsDistributionTable/components";
import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import { useQuery } from "@tanstack/react-query";
import { getNetBalances } from "lib/rewards";
import { usePathname } from "next/navigation";

export const useUnpaidRewardTokens = (queryKey: string, rewardsModuleAddress: string, includeNative?: boolean) => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const chainNativeCurrency = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.nativeCurrency.symbol;

  const { refetch, data, isLoading, isError } = useQuery({
    queryKey: [queryKey, rewardsModuleAddress],
    queryFn: async () => {
      if (rewardsModuleAddress) {
        const netBalances = await getNetBalances(rewardsModuleAddress, chainName.toLowerCase(), includeNative);

        const tokenAddresses = [...new Set(netBalances.map(token => token.tokenAddress))];
        const [tokenDecimals, tokenSymbols] = await Promise.all([
          getTokenDecimalsBatch(tokenAddresses, chainId),
          getTokenSymbolBatch(tokenAddresses, chainId),
        ]);

        const formattedBalances = netBalances.map(
          (token): ERC20Token => ({
            contractAddress: token.tokenAddress,
            tokenBalance: token.balance.toString(),
            tokenSymbol: token.tokenAddress === "native" ? chainNativeCurrency : tokenSymbols[token.tokenAddress],
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
