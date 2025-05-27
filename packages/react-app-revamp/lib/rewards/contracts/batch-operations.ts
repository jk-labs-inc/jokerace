import { config } from "@config/wagmi";
import { readContracts } from "@wagmi/core";
import { Abi } from "viem";
import { ModuleType } from "../types";

/**
 * Creates a contract read batch for native token data
 */
export const createNativeTokenReadBatch = (
  moduleType: ModuleType,
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  validRankings: number[],
  userAddress: `0x${string}`,
  functionName: string,
) => {
  return readContracts(config, {
    contracts: validRankings.map(ranking => ({
      address: contractAddress,
      chainId,
      abi,
      functionName,
      args: moduleType === ModuleType.VOTER_REWARDS ? [userAddress, BigInt(ranking)] : [BigInt(ranking)],
    })),
  });
};

/**
 * Creates a contract read for ERC20 token data
 */
export const createERC20TokenRead = (
  moduleType: ModuleType,
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  tokenAddress: `0x${string}`,
  ranking: number,
  userAddress: `0x${string}`,
  functionName: string,
) => {
  return readContracts(config, {
    contracts: [
      {
        address: contractAddress,
        chainId,
        abi,
        functionName,
        args:
          moduleType === ModuleType.VOTER_REWARDS
            ? [tokenAddress, userAddress, BigInt(ranking)]
            : [tokenAddress, BigInt(ranking)],
      },
    ],
  });
};
