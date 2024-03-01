import { config } from "@config/wagmi";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { erc20Abi } from "viem";

export const useTokenDecimals = (tokenAddress: string, chainId: number) => {
  const [decimals, setDecimals] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchTokenDecimals = async () => {
      try {
        const decimals = (await readContract(config, {
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          chainId: chainId,
          functionName: "decimals",
        })) as number;

        setDecimals(decimals ?? 18);
        setIsSuccess(true);
      } catch (err: any) {
        setDecimals(18);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDecimals();
  }, [chainId, tokenAddress]);

  return { decimals, isLoading, isSuccess };
};
