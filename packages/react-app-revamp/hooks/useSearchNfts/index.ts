import { addressRegex } from "@helpers/regex";
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

const NOT_SUPPORTED_NFT_STANDARD = "NO_SUPPORTED_NFT_STANDARD";
const NOT_A_CONTRACT = "NOT_A_CONTRACT";

export interface NFTMetadata {
  address: string;
  name: string;
  symbol: string;
  imageUrl: string;
  totalSupply: string | null;
  isVerified: boolean;
  tokenType: string;
}

const useSearchNfts = (chain: string, query: string) => {
  const isQueryTokenAddress = addressRegex.test(query);

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
      const filteredContracts = data.contracts.filter(
        (contract: { tokenType: string }) => contract.tokenType !== NOT_SUPPORTED_NFT_STANDARD,
      );

      contracts = filteredContracts.map((contract: any) => ({
        address: contract.address,
        name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
        symbol: contract.symbol,
        totalSupply: contract.totalSupply,
        tokenType: contract.tokenType,
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

        if (contract.tokenType === NOT_A_CONTRACT || contract.tokenType === NOT_SUPPORTED_NFT_STANDARD) {
          return [];
        }

        contracts = [
          {
            address: contract.address,
            name: contract.openSeaMetadata?.collectionName ? contract.openSeaMetadata.collectionName : contract.name,
            symbol: contract.symbol,
            totalSupply: contract.totalSupply,
            tokenType: contract.tokenType,
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

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchNfts", chain, query],
    queryFn: fetchNftContractMetadata,
    enabled: !!query,
  });

  return { data, error, isLoading };
};

export default useSearchNfts;
