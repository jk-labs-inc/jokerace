import { tokenAddressRegex } from "@helpers/regex";
import { useQuery } from "@tanstack/react-query";

const chainToAlchemySubdomain = {
  mainnet: "eth-mainnet",
  polygon: "polygon-mainnet",
  arbitrumone: "arb-mainnet",
  optimism: "opt-mainnet",
  base: "base-mainnet",
};

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const getAlchemyBaseUrl = (chain: string) => {
  const subdomain = chainToAlchemySubdomain[chain as keyof typeof chainToAlchemySubdomain] || "eth-mainnet";
  return `https://${subdomain}.g.alchemy.com/nft/v3/${alchemyApiKey}/searchContractMetadata`;
};

const getAlchemyBaseUrlForContractMetadata = (chain: string) => {
  const subdomain = chainToAlchemySubdomain[chain as keyof typeof chainToAlchemySubdomain] || "eth-mainnet";
  return `https://${subdomain}.g.alchemy.com/nft/v3/${alchemyApiKey}/getContractMetadata`;
};

export interface NFTMetadata {
  address: string;
  name: string;
  symbol: string;
  imageUrl: string;
  totalSupply: string | null;
  isVerified: boolean;
}

const useSearchNfts = (chain: string, query: string) => {
  const isQueryTokenAddress = tokenAddressRegex.test(query);

  const fetchNftContractMetadata = async (): Promise<NFTMetadata[]> => {
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
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.contracts && data.contracts.length > 0) {
      contracts = data.contracts.map((contract: any) => ({
        address: contract.address,
        name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
        symbol: contract.symbol,
        totalSupply: contract.totalSupply,
        imageUrl: contract.openSeaMetadata?.imageUrl
          ? contract.openSeaMetadata?.imageUrl
          : "/contest/mona-lisa-moustache.png",
        isVerified: contract.openSeaMetadata?.safelistRequestStatus === "verified" ? true : false,
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
        contracts = [
          {
            address: contract.address,
            name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
            symbol: contract.symbol,
            totalSupply: contract.totalSupply,
            imageUrl: contract.openSeaMetadata?.imageUrl
              ? contract.openSeaMetadata?.imageUrl
              : "/contest/mona-lisa-moustache.png",
            isVerified: contract.openSeaMetadata?.safelistRequestStatus === "verified" ? true : false,
          },
        ];
      }
    }

    return contracts;
  };

  const { data, error, isLoading } = useQuery(["searchNfts", chain, query], fetchNftContractMetadata, {
    enabled: !!query,
  });

  return { data, error, isLoading };
};

export default useSearchNfts;
