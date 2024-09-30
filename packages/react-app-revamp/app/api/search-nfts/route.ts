import { addressRegex } from "@helpers/regex";
import { NextRequest, NextResponse } from "next/server";

const chainToAlchemySubdomain = {
  mainnet: "eth-mainnet",
  polygon: "polygon-mainnet",
  arbitrumone: "arb-mainnet",
  optimism: "opt-mainnet",
  base: "base-mainnet",
};

const alchemyApiKey = process.env.ALCHEMY_KEY;

const NOT_SUPPORTED_NFT_STANDARD = "NO_SUPPORTED_NFT_STANDARD";
const NOT_A_CONTRACT = "NOT_A_CONTRACT";
const UNKNOWN = "UNKNOWN";

interface NFTMetadata {
  address: string;
  name: string;
  symbol: string;
  imageUrl: string;
  totalSupply: string | null;
  isVerified: boolean;
  tokenType: string;
}

const getAlchemyBaseUrl = (chain: string) => {
  const subdomain = chainToAlchemySubdomain[chain as keyof typeof chainToAlchemySubdomain] || "eth-mainnet";
  return `https://${subdomain}.g.alchemy.com/nft/v3/${alchemyApiKey}/searchContractMetadata`;
};

const getAlchemyBaseUrlForContractMetadata = (chain: string) => {
  const subdomain = chainToAlchemySubdomain[chain as keyof typeof chainToAlchemySubdomain] || "eth-mainnet";
  return `https://${subdomain}.g.alchemy.com/nft/v3/${alchemyApiKey}/getContractMetadata`;
};

function generateSymbolFromName(name: string): string {
  return name.substring(0, 4).toUpperCase();
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const chain = searchParams.get("chain");
  const query = searchParams.get("query");

  if (!chain || !query) {
    return NextResponse.json({ error: "invalid parameters" }, { status: 400 });
  }

  const isQueryTokenAddress = addressRegex.test(query);

  try {
    const contracts = await fetchNftContractMetadata(chain, query, isQueryTokenAddress);
    return NextResponse.json(contracts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "an error occurred while fetching nft metadata" }, { status: 500 });
  }
}

async function fetchNftContractMetadata(
  chain: string,
  query: string,
  isQueryTokenAddress: boolean,
): Promise<NFTMetadata[]> {
  if (!query) return [];

  let contracts = [];
  const baseUrl = getAlchemyBaseUrl(chain);
  const response = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.contracts && data.contracts.length > 0) {
    const filteredContracts = data.contracts.filter(
      (contract: { tokenType: string }) => contract.tokenType !== NOT_SUPPORTED_NFT_STANDARD,
    );

    contracts = filteredContracts.map((contract: any) => ({
      address: contract.address,
      name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
      symbol: contract.symbol ? contract.symbol : generateSymbolFromName(contract.name),
      totalSupply: contract.totalSupply,
      tokenType: contract.tokenType,
      imageUrl: contract.openSeaMetadata?.imageUrl
        ? contract.openSeaMetadata.imageUrl
        : "/contest/mona-lisa-moustache.png",
      isVerified: contract.openSeaMetadata?.safelistRequestStatus === "verified",
    }));
  } else if (isQueryTokenAddress) {
    const contractMetadataUrl = getAlchemyBaseUrlForContractMetadata(chain);
    const contractResponse = await fetch(`${contractMetadataUrl}?contractAddress=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (contractResponse.ok) {
      const contract = await contractResponse.json();

      if (
        contract.tokenType === NOT_A_CONTRACT ||
        contract.tokenType === NOT_SUPPORTED_NFT_STANDARD ||
        contract.tokenType === UNKNOWN
      ) {
        return [];
      }

      contracts = [
        {
          address: contract.address,
          name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
          symbol: contract.symbol ? contract.symbol : generateSymbolFromName(contract.name),
          totalSupply: contract.totalSupply,
          tokenType: contract.tokenType,
          imageUrl: contract.openSeaMetadata?.imageUrl
            ? contract.openSeaMetadata?.imageUrl
            : "/contest/mona-lisa-moustache.png",
          isVerified: contract.openSeaMetadata?.safelistRequestStatus === "verified",
        },
      ];
    }
  }

  return contracts;
}
