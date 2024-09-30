import { useQuery } from "@tanstack/react-query";

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
  const fetchNftContractMetadata = async (): Promise<NFTMetadata[]> => {
    if (!query) return [];

    const response = await fetch(
      `/api/search-nfts?chain=${encodeURIComponent(chain)}&query=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`network response was not ok: ${response.statusText}`);
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchNfts", chain, query],
    queryFn: fetchNftContractMetadata,
    enabled: !!query,
  });

  return { data, error, isLoading };
};

export default useSearchNfts;
