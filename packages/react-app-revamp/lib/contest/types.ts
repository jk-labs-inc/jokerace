import type { Abi } from "viem";

/**
 * Result of chain validation
 */
export interface ChainValidationResult {
  chainId: number;
  chain: string;
}

/**
 * Result of fetching contest contract info
 */
export interface ContestContractResult {
  abi: Abi;
  version: string;
}

/**
 * Contest details fetched from the blockchain
 */
export interface ContestDetails {
  name: string;
  prompt: string;
}

/**
 * Complete contest data returned from the loader
 */
export interface ContestLoaderData {
  address: string;
  chain: string;
  chainId: number;
  abi: Abi;
  version: string;
  contestDetails: ContestDetails;
}

/**
 * Default metadata for contest pages
 */
export interface ContestMetadata {
  title: string;
  description: string;
}

/**
 * Contest configuration passed to components
 */
export interface ContestConfig {
  address: `0x${string}`;
  chainName: string;
  chainId: number;
  chainNativeCurrencySymbol: string;
  abi: Abi;
  version: string;
}
