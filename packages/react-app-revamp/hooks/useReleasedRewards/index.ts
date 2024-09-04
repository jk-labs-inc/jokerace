import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { useRewardTokens } from "@hooks/useRewardsTokens";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useReadContracts } from "wagmi";

export interface ReleasedRewardsParams {
  contractAddress: string;
  chainId: number;
  abi: Abi | null;
  rankings: number[];
}

export interface ProcessedReleasedRewards {
  ranking: number;
  tokens: TokenInfo[];
}

export interface ReleasedRewardsResult {
  data: ProcessedReleasedRewards[] | null;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const getNativeTokenInfo = (chainId: number) => {
  const { nativeCurrency } = chains.filter(chain => chain.id === chainId)[0];
  return {
    symbol: nativeCurrency?.symbol,
    decimals: nativeCurrency?.decimals,
  };
};

export function useReleasedRewards({
  contractAddress,
  chainId,
  abi,
  rankings,
}: ReleasedRewardsParams): ReleasedRewardsResult {
  const asPath = usePathname();
  const { chainName: contestChainName } = extractPathSegments(asPath ?? "");
  const { data: erc20Addresses, isError: isRewardTokensError } = useRewardTokens(contractAddress, contestChainName);
  const nativeTokenInfo = getNativeTokenInfo(chainId);

  const {
    data: tokenInfo,
    isLoading: isTokenInfoLoading,
    isError: isTokenInfoError,
  } = useQuery({
    queryKey: ["tokenInfo", erc20Addresses, chainId],
    queryFn: async () => {
      const symbols = await getTokenSymbolBatch(erc20Addresses ?? [], chainId);
      const decimals = await getTokenDecimalsBatch(erc20Addresses ?? [], chainId);
      return { symbols, decimals };
    },
    enabled: !!erc20Addresses && erc20Addresses.length > 0,
    retry: 3,
  });

  if (!abi) return { data: null, isError: false, isLoading: false, refetch: () => {} };

  const calls = rankings.flatMap(ranking => [
    {
      address: contractAddress as `0x${string}`,
      chainId,
      abi,
      functionName: "released",
      args: [BigInt(ranking)],
    },
    ...(erc20Addresses ?? []).map(tokenAddress => ({
      address: contractAddress as `0x${string}`,
      chainId,
      abi,
      functionName: "erc20Released",
      args: [tokenAddress, BigInt(ranking)],
    })),
  ]);

  const { data, isError, isLoading, refetch } = useReadContracts({
    contracts: calls,
    query: {
      select(data): ProcessedReleasedRewards[] {
        const processedData = rankings.map((ranking, rankIndex) => {
          const startIndex = rankIndex * (1 + (erc20Addresses ?? []).length);
          const nativeAmount = data[startIndex]?.result as bigint | undefined;

          const result: ProcessedReleasedRewards = {
            ranking,
            tokens: [],
          };

          if (nativeAmount && nativeAmount > 0n) {
            result.tokens.push({
              address: "native",
              amount: nativeAmount,
              symbol: nativeTokenInfo.symbol,
              decimals: nativeTokenInfo.decimals,
            });
          }

          (erc20Addresses ?? []).forEach((address, index) => {
            const amount = data[startIndex + index + 1]?.result as bigint | undefined;
            if (amount && amount > 0n) {
              result.tokens.push({
                address,
                amount,
                symbol: tokenInfo?.symbols[address] || "UNKNOWN",
                decimals: tokenInfo?.decimals[address] ?? 18,
              });
            }
          });

          return result;
        });

        return processedData.filter(entry => entry.tokens.length > 0);
      },
    },
  });

  return {
    data: data && data.length > 0 ? data : [],
    isError: isError || isRewardTokensError || isTokenInfoError,
    isLoading: isLoading || isTokenInfoLoading,
    refetch,
  };
}
