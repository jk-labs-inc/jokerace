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

export interface NFTMetadata {
  address: string;
  name: string;
  imageUrl: string;
  totalSupply: string | null;
  isVerified: boolean;
}

const useSearchNfts = (chain: string, query: string) => {
  const fetchNftContractMetadata = async (): Promise<NFTMetadata[]> => {
    if (!query) return [];

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

    const contracts = data.contracts.map((contract: any) => ({
      address: contract.address,
      name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
      totalSupply: contract.totalSupply,
      imageUrl: contract.openSeaMetadata?.imageUrl
        ? contract.openSeaMetadata?.imageUrl
        : "/contest/mona-lisa-moustache.png",
      isVerified: contract.openSeaMetadata?.safelistRequestStatus === "verified" ? true : false,
    }));

    return contracts;
  };

  const { data, error, isLoading } = useQuery(["searchNfts", chain, query], fetchNftContractMetadata, {
    enabled: !!query,
  });

  return { data, error, isLoading };
};

export default useSearchNfts;
