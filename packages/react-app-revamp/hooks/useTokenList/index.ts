import { config } from "@config/wagmi";
import { addressRegex } from "@helpers/regex";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getToken } from "@wagmi/core";

export interface FilteredToken {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  balance?: number;
}

interface PaginationInfo {
  totalLength: number;
  hasMore: boolean;
  pageParam: number;
}

const TOKEN_LIST_API_URL = "/api/token";
const pageSize = 20;

export const TOKENLISTOOOR_SUPPORTED_CHAIN_IDS = [
  1, 10, 100, 1088, 1101, 137, 250, 314, 324, 42161, 42220, 43114, 5, 5000, 534352, 56, 59144, 7777777, 81457, 8453,
];

async function fetchTokenListOrMetadata({
  pageParam = 0,
  chainId,
  tokenIdentifier,
}: {
  pageParam?: number;
  chainId: number;
  tokenIdentifier: string;
}): Promise<{ tokens: FilteredToken[]; pagination: PaginationInfo }> {
  if (!TOKENLISTOOOR_SUPPORTED_CHAIN_IDS.includes(chainId)) {
    return fetchTokenByAddress({ chainId, tokenIdentifier });
  }

  const response = await fetch(
    `${TOKEN_LIST_API_URL}?chainId=${chainId}&tokenIdentifier=${encodeURIComponent(
      tokenIdentifier,
    )}&page=${pageParam}&limit=${pageSize}`,
  );

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.tokens && data.tokens.length > 0) {
    return {
      tokens: data.tokens.map((token: any) => ({
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        logoURI:
          token.logoURI === "" || token.logoURI === "missing_thumb.png"
            ? "/contest/mona-lisa-moustache.png"
            : token.logoURI,
      })),
      pagination: {
        totalLength: data.pagination.totalLength,
        hasMore: data.pagination.hasMore,
        pageParam: pageParam,
      },
    };
  }

  return fetchTokenByAddress({ chainId, tokenIdentifier });
}

async function fetchTokenByAddress({
  chainId,
  tokenIdentifier,
}: {
  chainId: number;
  tokenIdentifier: string;
}): Promise<{ tokens: FilteredToken[]; pagination: PaginationInfo }> {
  if (addressRegex.test(tokenIdentifier)) {
    const token = await getToken(config, {
      address: tokenIdentifier as `0x${string}`,
      chainId,
    });

    const tokenData: FilteredToken = {
      address: tokenIdentifier,
      name: token.name ?? "",
      symbol: token.symbol ?? "",
      logoURI: "/contest/mona-lisa-moustache.png",
    };

    if (tokenData.name === "" || tokenData.symbol === "") {
      return {
        tokens: [],
        pagination: { totalLength: 0, hasMore: false, pageParam: 0 },
      };
    }

    return {
      tokens: [tokenData],
      pagination: {
        totalLength: 1,
        hasMore: false,
        pageParam: 0,
      },
    };
  }

  return { tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } };
}

export function useTokenList(chainId: number, tokenIdentifier: string) {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["searchTokens", chainId, tokenIdentifier],
    queryFn: ({ pageParam = 0 }) => fetchTokenListOrMetadata({ pageParam, chainId, tokenIdentifier }),
    getNextPageParam: lastPage => {
      return lastPage.pagination.hasMore ? (lastPage.pagination.pageParam ?? 0) + 1 : undefined;
    },
    initialPageParam: 0,
  });

  const tokens = data?.pages.flatMap(page => page.tokens) || [];

  return {
    loading: isLoading,
    error: isError ? error : null,
    tokens,
    fetchTokenListPerPage: fetchNextPage,
    hasMore: hasNextPage,
  };
}
