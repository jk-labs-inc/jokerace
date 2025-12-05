import { extractPathSegments } from "@helpers/extractPath";
import { getNativeTokenInfo } from "@helpers/getNativeTokenInfo";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { useRewardTokens } from "@hooks/useRewardsTokens";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import { Abi } from "viem";
import { useReadContracts } from "wagmi";
import { useShallow } from "zustand/shallow";

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

export interface TotalRewardInfo {
  address: string;
  symbol: string;
  decimals: number;
  totalAmount: bigint;
}

export interface ReleasedRewardsResult {
  data: ProcessedReleasedRewards[] | null;
  totalRewards: TotalRewardInfo[];
  isContractError: boolean;
  isErc20AddressesError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export function useReleasedRewards({
  contractAddress,
  chainId,
  abi,
  rankings,
}: ReleasedRewardsParams): ReleasedRewardsResult {
  const contestChainName = useContestConfigStore(useShallow(state => state.contestConfig.chainName));
  const { data: erc20Addresses, isError: isErc20AddressesError } = useRewardTokens(contractAddress, contestChainName);
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

  if (!abi)
    return {
      data: null,
      totalRewards: [],
      isContractError: false,
      isErc20AddressesError: false,
      isLoading: false,
      refetch: () => {},
    };

  const calls = useMemo(
    () =>
      rankings.flatMap(ranking => [
        {
          address: contractAddress as `0x${string}`,
          chainId,
          abi,
          functionName: "released",
          args: [BigInt(ranking)],
        },
        ...(erc20Addresses?.map(tokenAddress => ({
          address: contractAddress as `0x${string}`,
          chainId,
          abi,
          functionName: "erc20Released",
          args: [tokenAddress, BigInt(ranking)],
        })) ?? []),
      ]),
    [rankings, contractAddress, chainId, abi, erc20Addresses],
  );

  const {
    data,
    isError: isContractError,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: calls,
    query: {
      select(data): { processedData: ProcessedReleasedRewards[]; totalRewards: TotalRewardInfo[] } {
        const processedData = rankings.map((ranking, rankIndex) => {
          const startIndex = rankIndex * (1 + (erc20Addresses?.length ?? 0));
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

        const totalRewardsMap = new Map<string, TotalRewardInfo>();

        processedData.forEach(entry => {
          entry.tokens.forEach(token => {
            const existingTotal = totalRewardsMap.get(token.address);
            if (existingTotal) {
              existingTotal.totalAmount += token.amount ?? 0n;
            } else {
              totalRewardsMap.set(token.address, {
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals ?? 18,
                totalAmount: token.amount ?? 0n,
              });
            }
          });
        });

        return {
          processedData: processedData.filter(entry => entry.tokens.length > 0),
          totalRewards: Array.from(totalRewardsMap.values()),
        };
      },
      enabled: calls.length > 0,
    },
  });

  return {
    data: data?.processedData && data.processedData.length > 0 ? data.processedData : [],
    totalRewards: data?.totalRewards ?? [],
    isContractError,
    isErc20AddressesError,
    isLoading: isLoading || isTokenInfoLoading,
    refetch,
  };
}
