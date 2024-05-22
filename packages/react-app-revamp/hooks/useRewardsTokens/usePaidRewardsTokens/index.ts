import { ERC20Token } from "@components/_pages/RewardsDistributionTable/components";
import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import { getTokenDecimalsBatch } from "@helpers/getTokenDecimals";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useQuery } from "@tanstack/react-query";
import { getPaidBalances } from "lib/rewards";
import { usePathname } from "next/navigation";

export const usePaidRewardTokens = () => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const { rewards } = useRewardsStore(state => state);
  const rewardsModuleAddress = rewards?.contractAddress;

  const { refetch, data } = useQuery({
    queryKey: ["paid-reward-tokens", rewardsModuleAddress],
    queryFn: async () => {
      if (rewardsModuleAddress) {
        const paidBalances = await getPaidBalances(rewardsModuleAddress);

        const tokenAddresses = [...new Set(paidBalances.map(token => token.tokenAddress))];
        const tokenDecimals = await getTokenDecimalsBatch(tokenAddresses, chainId);

        const formattedBalances = paidBalances.map(
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
    refetchPaidTokens: refetch,
    paidTokens: data,
  };
};

export default usePaidRewardTokens;
