import { chains, config } from "@config/wagmi";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Abi, erc20Abi, erc721Abi } from "viem";

const useTokenDetails = (tokenType: string, tokenAddress: string, chain: string) => {
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const chainId = chains.find((c: { name: string }) => c.name === chain)?.id;

  useEffect(() => {
    if (!tokenAddress || !chainId || !tokenType) return;
    setIsLoading(true);

    const fetchTokenDetails = async () => {
      try {
        const abi = tokenType === "erc20" ? erc20Abi : erc721Abi;
        const contractConfig = {
          address: tokenAddress as `0x${string}`,
          abi: abi as Abi,
          chainId: chainId,
        };

        let tokenSymbolOrName = (await readContract(config, {
          ...contractConfig,
          functionName: "symbol",
        })) as string;

        if (!tokenSymbolOrName) {
          tokenSymbolOrName = (await readContract(config, {
            ...contractConfig,
            functionName: "name",
          })) as string;
        }

        setTokenSymbol(tokenSymbolOrName);
        setIsSuccess(true);
      } catch (err) {
        setTokenSymbol(tokenType === "erc20" ? "ERC20 TOKEN" : "NFT");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();
  }, [tokenAddress, chainId, tokenType]);

  return { tokenSymbol, isLoading, isSuccess };
};

export default useTokenDetails;
