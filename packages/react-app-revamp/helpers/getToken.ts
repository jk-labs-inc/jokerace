import { config } from "@config/wagmi";
import { readContracts } from "@wagmi/core";
import { erc20Abi } from "viem";

export interface TokenInfo {
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: bigint;
}

export interface GetTokenParams {
  address: `0x${string}`;
  chainId: number;
}

export const getToken = async ({ address, chainId }: GetTokenParams): Promise<TokenInfo> => {
  const [decimals, name, symbol, totalSupply] = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "totalSupply",
        chainId,
      },
    ],
  });

  return {
    decimals,
    name,
    symbol,
    totalSupply,
  };
};
