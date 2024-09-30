import { NextRequest, NextResponse } from "next/server";
import { formatEther } from "@ethersproject/units";
import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";

const etherscanApiKey = process.env.ETHERSCAN_KEY;
const etherscanBaseUrl = `https://api.etherscan.io/api`;
const ERC20_HARD_LIMIT = 1000000;
const BASE_LIMIT = 100000;

type VoteCalculationMethod = "token" | "token holder";

interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

interface EtherscanApiResponse {
  status: string;
  message: string;
  result: TokenHolder[];
}

interface OwnersBalancesRecord {
  [ownerAddress: string]: number;
}

export async function POST(req: NextRequest) {
  const { type, contractAddress, chainName, minTokensRequired, votesPerUnit, voteCalculationMethod } = await req.json();

  if (!etherscanApiKey) {
    return NextResponse.json({ error: "Etherscan API key is not provided." }, { status: 500 });
  }

  let allTokenHoldersData: TokenHolder[] = [];
  let page = 1;
  const offset = 10000;

  try {
    while (true) {
      const queryParams = new URLSearchParams({
        module: "token",
        action: "tokenholderlist",
        contractaddress: contractAddress,
        page: page.toString(),
        offset: offset.toString(),
        apikey: etherscanApiKey,
      });

      const response = await fetch(`${etherscanBaseUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: `Network response was not ok ${response.statusText}` }, { status: 500 });
      }

      const data: EtherscanApiResponse = await response.json();
      const tokenHolders = data.result || [];

      allTokenHoldersData.push(...tokenHolders);

      if (tokenHolders.length === 0) {
        if (page === 1) {
          return NextResponse.json({ error: "according to etherscan, this token has 0 holders." }, { status: 404 });
        } else {
          break;
        }
      }

      if (allTokenHoldersData.length > ERC20_HARD_LIMIT) {
        return NextResponse.json(
          { error: `tokens of more than ${formatNumber(ERC20_HARD_LIMIT)} holders aren't currently supported` },
          { status: 400 },
        );
      }

      page++;
    }
  } catch (error: any) {
    console.error("There was a problem with the ERC20 fetch operation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // process the data
  const processedData = processTokenHoldersData(
    allTokenHoldersData,
    votesPerUnit,
    voteCalculationMethod,
    minTokensRequired,
    type,
  );

  return NextResponse.json(processedData);
}

function processTokenHoldersData(
  tokenHolders: TokenHolder[],
  votesPerUnit: number,
  voteCalculationMethod: VoteCalculationMethod,
  minTokensRequired: number,
  eventType: "voting" | "submission",
): OwnersBalancesRecord | { error: string } {
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedHoldersCount = 0;

  for (const holder of tokenHolders) {
    const holderAddress: string = holder.TokenHolderAddress;
    const tokenQuantityInWei = holder.TokenHolderQuantity;

    const tokenQuantityInEther = Math.round(parseFloat(formatEther(tokenQuantityInWei)));

    if (tokenQuantityInEther >= minTokensRequired) {
      qualifiedHoldersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          totalVotes = tokenQuantityInEther * votesPerUnit;
        } else if (voteCalculationMethod === "token holder") {
          totalVotes = votesPerUnit;
        }
      } else if (eventType === "submission") {
        totalVotes = 10;
      }

      ownersBalancesRecord[holderAddress] = totalVotes;
    }

    if (qualifiedHoldersCount >= MAX_ROWS) {
      const errorMessage = `cannot support over ${formatNumber(BASE_LIMIT)} ${
        eventType === "voting" ? "voters" : "submitters"
      }: raise min. tokens required`;

      return { error: errorMessage };
    }
  }

  return ownersBalancesRecord;
}
