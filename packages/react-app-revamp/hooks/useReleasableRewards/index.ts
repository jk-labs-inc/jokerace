import { extractPathSegments } from "@helpers/extractPath";
import { getNativeTokenInfo } from "@helpers/getNativeTokenInfo";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import { useRewardTokens } from "@hooks/useRewardsTokens";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Abi } from "viem";
import { useReadContracts } from "wagmi";

export interface ReleasableRewardsParams {
  contractAddress: string;
  chainId: number;
  abi: Abi;
  rankings: number[];
}

export interface TokenInfo {
  address: string;
  amount: bigint | undefined;
  symbol: string;
  decimals: number | undefined;
}

export interface ProcessedReleasableRewards {
  ranking: number;
  tokens: TokenInfo[];
}

export interface ReleasableRewardsResult {
  data: ProcessedReleasableRewards[] | null;
  isContractError: boolean;
  isErc20AddressesError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export function useReleasableRewards({
  contractAddress,
  chainId,
  abi,
  rankings,
}: ReleasableRewardsParams): ReleasableRewardsResult {
  const asPath = usePathname();
  const { chainName: contestChainName } = extractPathSegments(asPath ?? "");
  const { data: erc20Addresses, isError: isErc20AddressesError } = useRewardTokens(contractAddress, contestChainName);
  const nativeTokenInfo = getNativeTokenInfo(chainId);
  const { data: tokenInfo, isLoading: isTokenInfoLoading } = useQuery({
    queryKey: ["tokenInfo", erc20Addresses, chainId],
    queryFn: async () => {
      const symbols = await getTokenSymbolBatch(erc20Addresses ?? [], chainId);
      const decimals = await getTokenDecimalsBatch(erc20Addresses ?? [], chainId);
      return { symbols, decimals };
    },
    enabled: !!erc20Addresses && erc20Addresses.length > 0,
    retry: 3,
  });

  const calls = useMemo(() => {
    return rankings.flatMap(ranking => [
      {
        address: contractAddress as `0x${string}`,
        chainId,
        abi,
        functionName: "releasable",
        args: [BigInt(ranking)],
      },
      ...(erc20Addresses?.map(tokenAddress => ({
        address: contractAddress as `0x${string}`,
        chainId,
        abi,
        functionName: "releasable",
        args: [tokenAddress, BigInt(ranking)],
      })) ?? []),
    ]);
  }, [abi, contractAddress, chainId, rankings, erc20Addresses]);

  const {
    data,
    isError: isContractError,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: calls,
    query: {
      select(data): ProcessedReleasableRewards[] {
        const processedData = rankings.map((ranking, rankIndex) => {
          const startIndex = rankIndex * (1 + (erc20Addresses?.length ?? 0));
          const nativeAmount = data[startIndex]?.result as bigint | undefined;

          const result: ProcessedReleasableRewards = {
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

          erc20Addresses?.forEach((address, index) => {
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
      enabled: calls.length > 0,
    },
  });

  return {
    data: data && data.length > 0 ? data : [],
    isContractError,
    isErc20AddressesError,
    isLoading: isLoading || isTokenInfoLoading,
    refetch,
  };
}