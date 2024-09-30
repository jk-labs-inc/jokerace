import { NextRequest, NextResponse } from "next/server";
import { chains } from "@config/wagmi";
import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { VoteCalculationMethod } from "lib/permissioning";

const alchemyApiKey = process.env.ALCHEMY_KEY;
const NFTS_HARD_LIMIT = 400000;
const BASE_LIMIT = 100000;

interface Token {
  tokenId: string;
  balance: number;
}

interface OwnerData {
  ownerAddress: string;
  tokenBalances: Token[];
}

interface OwnersBalancesRecord {
  [ownerAddress: string]: number;
}

const ensureHexFormat = (tokenId: string): string => {
  tokenId = tokenId.trim();

  if (!tokenId.startsWith("0x")) {
    tokenId = "0x" + BigInt(tokenId).toString(16);
  }

  return tokenId;
};

const areHexTokenIdsEqual = (hexTokenId1: string, hexTokenId2: string): boolean => {
  return BigInt(hexTokenId1) === BigInt(hexTokenId2);
};

export async function POST(req: NextRequest) {
  const { type, contractAddress, chainName, minTokensRequired, tokenId, votesPerUnit, voteCalculationMethod } =
    await req.json();

  let baseAlchemyAppUrl = chains.filter((chain: { name: string }) => chain.name == chainName.toLowerCase())[0].rpcUrls
    .default.http[0];

  baseAlchemyAppUrl = baseAlchemyAppUrl.replace(/(v2\/).*/, "$1");

  const alchemyAppUrl = `${baseAlchemyAppUrl}${alchemyApiKey}/getOwnersForCollection`;

  let allOwnersData: OwnerData[] = [];
  let nextPageKey: string | undefined;

  do {
    const queryParams = new URLSearchParams({
      contractAddress,
      withTokenBalances: "true",
    });

    if (nextPageKey) {
      queryParams.append("pageKey", nextPageKey);
    }

    try {
      const response = await fetch(`${alchemyAppUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: `Network response was not ok ${response.statusText}` }, { status: 500 });
      }

      const data = await response.json();
      const ownersData = data.ownerAddresses || [];

      if (ownersData.length === 0) {
        return NextResponse.json({ error: "according to alchemy, this collection has 0 holders." }, { status: 404 });
      }

      allOwnersData.push(...ownersData);

      if (allOwnersData.length > NFTS_HARD_LIMIT) {
        return NextResponse.json(
          { error: `collections of more than ${formatNumber(NFTS_HARD_LIMIT)} holders aren't currently supported` },
          { status: 400 },
        );
      }

      nextPageKey = data.pageKey;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      return NextResponse.json({ error: "An error occurred while fetching NFT holders" }, { status: 500 });
    }
  } while (nextPageKey);

  const processedData = processNftOwnersData(
    allOwnersData,
    voteCalculationMethod,
    votesPerUnit,
    minTokensRequired,
    type,
    tokenId,
  );

  if ("error" in processedData) {
    return NextResponse.json({ error: processedData.error }, { status: 400 });
  }

  return NextResponse.json(processedData);
}

function processNftOwnersData(
  ownersData: OwnerData[],
  voteCalculationMethod: VoteCalculationMethod,
  votesPerUnit: number,
  minTokensRequired: number,
  eventType: "voting" | "submission",
  tokenId?: string,
): OwnersBalancesRecord | { error: string } {
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedOwnersCount = 0;

  for (const owner of ownersData) {
    const ownerAddress: string = owner.ownerAddress;
    let filteredTokenBalances = owner.tokenBalances;

    if (tokenId) {
      const formattedTokenId = ensureHexFormat(tokenId);

      filteredTokenBalances = owner.tokenBalances.filter(tokenBalance =>
        areHexTokenIdsEqual(tokenBalance.tokenId.trim(), formattedTokenId),
      );
    }

    const numTokens = filteredTokenBalances.reduce((sum: number, tokenBalance: Token) => sum + tokenBalance.balance, 0);

    if (numTokens >= minTokensRequired) {
      qualifiedOwnersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          totalVotes = numTokens * votesPerUnit;
        } else if (voteCalculationMethod === "token holder") {
          totalVotes = filteredTokenBalances.length > 0 ? votesPerUnit : 0;
        }
      } else if (eventType === "submission") {
        totalVotes = 10; // hardcoded to 10 for submission allowlists
      }

      ownersBalancesRecord[ownerAddress] = totalVotes;
    }

    if (qualifiedOwnersCount >= MAX_ROWS) {
      const errorMessage = `cannot support over ${formatNumber(BASE_LIMIT)} ${
        eventType === "voting" ? "voters" : "submitters"
      }: raise min. NFTs required`;

      return { error: errorMessage };
    }
  }

  if (qualifiedOwnersCount === 0) {
    return { error: "No qualified owners found based on the provided criteria." };
  }

  return ownersBalancesRecord;
}
