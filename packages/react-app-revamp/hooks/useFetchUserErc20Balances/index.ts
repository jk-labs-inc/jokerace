import { useQuery } from "@tanstack/react-query";
import { chains } from "@config/wagmi";
import { useAccount } from "wagmi";

// Assuming you've set the interface for TokenBalance
interface TokenBalance {
  tokenAddress: string;
  tokenBalance: string;
}

const useFetchUserERC20Balances = (userAddress: string, chainName: string) => {
  const {
    data: balances,
    error,
    isLoading,
    refetch,
  } = useQuery<TokenBalance[], Error>(
    ["user-erc20-balance", chainName, userAddress],
    async () => {
      if (!userAddress) throw new Error("Wallet address is not available");

      const alchemyAppUrl = chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0]?.rpcUrls
        .default.http[0];
      if (!alchemyAppUrl) throw new Error("RPC URL is not available for the selected chain");

      const response = await fetch(alchemyAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [userAddress, "erc20"],
          id: 42,
        }),
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const asJson = await response.json();
      return asJson.result?.tokenBalances ?? [];
    },
    {
      enabled: !!userAddress && !!chainName && !!process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    },
  );

  return { balances, error, isLoading, refetchUserBalances: refetch };
};

export default useFetchUserERC20Balances;
