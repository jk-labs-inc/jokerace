import { chains } from "@config/wagmi";
import { FilteredToken } from "@hooks/useTokenList";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "ethers/lib/utils";

const ZERO_BALANCE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const useFetchUserTokens = (userAddress: string, chainName: string) => {
  const {
    data: tokens,
    error,
    isLoading,
    refetch,
  } = useQuery<FilteredToken[], Error>(
    ["user-erc20-balance", chainName, userAddress],
    async (): Promise<FilteredToken[]> => {
      if (!userAddress) throw new Error("Wallet address is not available");

      const alchemyAppUrl = chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0]?.rpcUrls
        .default.http[0];

      if (!alchemyAppUrl) throw new Error("Alchemy RPC URL is not available for the selected chain");

      const tokenBalancesResponse = await fetch(alchemyAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [userAddress, "erc20"],
          id: 1,
        }),
        redirect: "follow",
      });

      if (!tokenBalancesResponse.ok) {
        throw new Error(`Failed to fetch token balances: ${tokenBalancesResponse.status}`);
      }

      const tokenBalancesData = await tokenBalancesResponse.json();

      const nonZeroBalances = tokenBalancesData.result.tokenBalances.filter(
        (tb: any) => tb.tokenBalance !== ZERO_BALANCE,
      );

      const metadataPromises = nonZeroBalances.slice(0, 4).map(async (token: any) => {
        const metadataResponse = await fetch(alchemyAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenMetadata",
            params: [token.contractAddress],
            id: 1,
          }),
        });

        if (!metadataResponse.ok) {
          console.error(`Failed to fetch metadata for token: ${token.contractAddress}`);
          return null;
        }

        const metadata = await metadataResponse.json();

        if (!metadata.result.name || !metadata.result.symbol) {
          return null;
        }

        const formattedTokenBalance = parseFloat(formatUnits(token.tokenBalance, metadata.decimals));

        return {
          address: token.contractAddress,
          name: metadata.result.name,
          symbol: metadata.result.symbol,
          logoURI: metadata.result.logo ? metadata.result.logo : "/contest/mona-lisa-moustache.png",
          balance: formattedTokenBalance,
        };
      });

      const filteredTokens: FilteredToken[] = (await Promise.all(metadataPromises)).filter(Boolean) as FilteredToken[];
      return filteredTokens;
    },
    {
      enabled: !!userAddress && !!chainName && !!process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    },
  );

  return { tokens, error, isLoading, refetchUserBalances: refetch };
};
