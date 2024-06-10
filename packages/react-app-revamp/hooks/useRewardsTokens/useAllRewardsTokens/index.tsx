import { ERC20Token } from "@components/_pages/RewardsDistributionTable/components";
import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import { useQuery } from "@tanstack/react-query";
import { getAllBalances } from "lib/rewards";
import { usePathname } from "next/navigation";

interface ERC20TokenExtended extends ERC20Token {
  tokenSymbol: string;
}

export const useAllRewardsTokens = (queryKey: string, rewardsModuleAddress: string) => {
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
        const allBalances = await getAllBalances(rewardsModuleAddress, chainName.toLowerCase());

        const tokenAddresses = [...new Set(allBalances.map(token => token.tokenAddress))];
        const tokenDecimals = await getTokenDecimalsBatch(tokenAddresses, chainId);
        const tokenSymbols = await getTokenSymbolBatch(tokenAddresses, chainId);

        const formattedBalances = allBalances.map(
          (token): ERC20TokenExtended => ({
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
    refetchPaidTokens: refetch,
    allBalances: data,
    isLoading,
    isError,
  };
};

export default useAllRewardsTokens;
