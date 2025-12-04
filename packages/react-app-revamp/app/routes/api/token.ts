import { createFileRoute } from "@tanstack/react-router";
import Fuse from "fuse.js";

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

interface TokenList {
  name: string;
  description: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  logoURI: string;
  keywords: string[];
  tokens: Token[];
}

interface TokenResult {
  tokens: FilteredToken[];
  pagination: {
    totalLength: number;
    hasMore: boolean;
    pageParam: number;
  };
}

interface FilteredToken {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
}

const DEFILLAMA_TOKEN_LIST_URL = "https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/popular.json";

const fetchTokenList = async (): Promise<TokenList | null> => {
  const response = await fetch(DEFILLAMA_TOKEN_LIST_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

async function fetchAndFilterToken(
  chainId: number,
  tokenIdentifier: string,
  page: number = 0,
  limit: number = 20,
): Promise<TokenResult> {
  try {
    const data = await fetchTokenList();
    if (!data) return { tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } };

    const tokensForChain = data.tokens.filter(token => token.chainId === chainId);

    const fuseOptions = {
      includeScore: true,
      keys: [
        { name: "symbol", weight: 0.7 },
        { name: "name", weight: 0.2 },
        { name: "address", weight: 0.1 },
      ],
      threshold: 0.3,
    };
    const fuse = new Fuse(tokensForChain, fuseOptions);
    const fuseResults = fuse.search(tokenIdentifier);

    const totalLength = fuseResults.length;
    const tokens = fuseResults.slice(page * limit, (page + 1) * limit).map(result => ({
      address: result.item.address,
      name: result.item.name,
      symbol: result.item.symbol,
      logoURI: result.item.logoURI,
    }));

    return {
      tokens,
      pagination: {
        totalLength,
        hasMore: totalLength > (page + 1) * limit,
        pageParam: page,
      },
    };
  } catch (error) {
    console.error("Error fetching or processing token list:", error);
    return { tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } };
  }
}

export const Route = createFileRoute("/api/token")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const chainId = searchParams.get("chainId");
        const tokenIdentifier = searchParams.get("tokenIdentifier")?.trim() ?? "";
        const page = searchParams.get("page") ?? "0";
        const limit = searchParams.get("limit") ?? "10";

        const parsedChainId = parseInt(chainId ?? "", 10);
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedChainId) || isNaN(parsedPage) || isNaN(parsedLimit) || !tokenIdentifier) {
          return new Response(JSON.stringify({ error: "Invalid parameters." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const response = await fetchAndFilterToken(parsedChainId, tokenIdentifier, parsedPage, parsedLimit);
          return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(error);
          return new Response(JSON.stringify({ error: error.message ?? "Internal server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
} as any);
