import { config } from "@config/wagmi";
import { readContract } from "@wagmi/core";
import { erc20Abi } from "viem";

export const getTokenDecimals = async (tokenAddress: string, chainId: number) => {
  try {
    const decimals = (await readContract(config, {
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      chainId: chainId,
      functionName: "decimals",
    })) as number;

    return decimals;
  } catch {
    return null;
  }
};

export const getTokenSymbol = async (tokenAddress: string, chainId: number) => {
  try {
    const symbol = (await readContract(config, {
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      chainId: chainId,
      functionName: "symbol",
    })) as string;

    return symbol;
  } catch {
    return null;
  }
};

export const getTokenDecimalsBatch = async (
  tokenAddresses: string[],
  chainId: number,
): Promise<{ [address: string]: number }> => {
  const decimalsPromises = tokenAddresses.map(async address => {
    const decimals = await getTokenDecimals(address, chainId);
    return { address, decimals };
  });

  const decimalsArray = await Promise.all(decimalsPromises);

  return decimalsArray.reduce(
    (acc, { address, decimals }) => {
      if (decimals !== null) {
        acc[address] = decimals;
      }
      return acc;
    },
    {} as { [address: string]: number },
  );
};

export const getTokenSymbolBatch = async (
  tokenAddresses: string[],
  chainId: number,
): Promise<{ [address: string]: string }> => {
  const symbolPromises = tokenAddresses.map(async address => {
    const symbol = await getTokenSymbol(address, chainId);
    return { address, symbol };
  });

  const symbolArray = await Promise.all(symbolPromises);

  return symbolArray.reduce(
    (acc, { address, symbol }) => {
      if (symbol !== null) {
        acc[address] = symbol;
      }
      return acc;
    },
    {} as { [address: string]: string },
  );
};
