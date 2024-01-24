import { chains } from "@config/wagmi";
import { erc20ABI, erc721ABI, readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Abi } from "viem";

const useTokenDetails = (tokenType: string, tokenAddress: string, chain: string) => {
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const chainId = chains.find(c => c.name === chain)?.id;

  useEffect(() => {
    if (!tokenAddress || !chainId || !tokenType) return;
    setIsLoading(true);

    const fetchTokenDetails = async () => {
      try {
        const abi = tokenType === "erc20" ? erc20ABI : erc721ABI;
        const symbol = (await readContract({
          address: tokenAddress as `0x${string}`,
          abi: abi as unknown as Abi,
          chainId: chainId,
          functionName: "symbol",
        })) as string;

        setTokenSymbol(symbol);
        setIsSuccess(true);
      } catch (err: any) {
        if (tokenType === "erc20") {
          setTokenSymbol("ERC20 TOKEN");
        } else {
          setTokenSymbol("NFT");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();
  }, [tokenAddress, chainId, tokenType]);

  return { tokenSymbol, isLoading, isSuccess };
};

export default useTokenDetails;
