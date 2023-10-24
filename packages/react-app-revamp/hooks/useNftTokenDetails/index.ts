import { chains } from "@config/wagmi";
import { erc721ABI, readContract } from "@wagmi/core";
import { useEffect, useState } from "react";

const useNftTokenDetails = (tokenAddress: string, chain: string) => {
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const adjustedChainName = adjustChainName(chain);

    const chainId = chains.find(c => c.name === adjustedChainName)?.id;

    if (!tokenAddress || !chainId) return;

    const fetchTokenDetails = async () => {
      try {
        const symbol = await readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc721ABI,
          chainId: chainId,
          functionName: "symbol",
        });

        setTokenSymbol(symbol);
        setIsSuccess(true);
      } catch (err: any) {
        setTokenSymbol("NFT");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();
  }, [tokenAddress, chain]);

  const adjustChainName = (chain: string) => (chain === "arbitrum" ? "arbitrumone" : chain);

  return { tokenSymbol, isLoading, isSuccess };
};

export default useNftTokenDetails;
