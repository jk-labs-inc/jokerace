import { tokenAddressRegex } from "@helpers/regex";
import { useInfiniteQuery } from "@tanstack/react-query";

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

const TOKEN_LIST_API_URL = "/api/token/token";
const pageSize = 20;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const ALCHEMY_BASE_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

async function fetchTokenListOrMetadata({
  pageParam = 0,
  chainId,
  tokenIdentifier,
}: {
  pageParam?: number;
  chainId: number;
  tokenIdentifier: string;
}): Promise<{ tokens: FilteredToken[]; pagination: PaginationInfo }> {
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

  if (tokenAddressRegex.test(tokenIdentifier) && (!data.tokens || data.tokens.length === 0)) {
    const alchemyResponse = await fetch(`${ALCHEMY_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "alchemy_getTokenMetadata",
        params: [tokenIdentifier],
      }),
    });

    if (!alchemyResponse.ok) {
      throw new Error(`Network response was not ok: ${alchemyResponse.statusText}`);
    }

    const alchemyData = await alchemyResponse.json();
    const tokenData: FilteredToken = {
      address: tokenIdentifier,
      name: alchemyData.result.name,
      symbol: alchemyData.result.symbol,
      logoURI: alchemyData.result.logo ? alchemyData.result.logo : "/contest/mona-lisa-moustache.png",
    };
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
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["searchTokens", chainId, tokenIdentifier],
    ({ pageParam = 0 }) => fetchTokenListOrMetadata({ pageParam, chainId, tokenIdentifier }),
    {
      getNextPageParam: lastPage => {
        return lastPage.pagination.hasMore ? (lastPage.pagination.pageParam ?? 0) + 1 : undefined;
      },
    },
  );

  const tokens = data?.pages.flatMap(page => page.tokens) || [];

  return {
    loading: isLoading,
    error: isError ? error : null,
    tokens,
    fetchTokenListPerPage: fetchNextPage,
    hasMore: hasNextPage,
  };
}
