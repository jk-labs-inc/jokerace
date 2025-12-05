import { notFound } from "@tanstack/react-router";
import { readContracts } from "@wagmi/core";
import type { Abi } from "viem";
import { serverConfig, chains } from "@config/wagmi/server";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { ContestParamsSchema } from "./schemas";
import type { ContestDetails, ContestLoaderData } from "./types";
import { config } from "@config/wagmi";

/**
 * Validates that the chain exists in our supported chains list
 *
 * @throws notFound() if chain is not supported
 * @returns chainId if valid
 */
export const validateChain = (chainName: string): number => {
  const isValidChain = chains.some(
    (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  );

  if (!isValidChain) {
    throw notFound();
  }

  return getChainId(chainName);
};

/**
 * Fetches the contract ABI and version for a given contest address
 *
 * @throws notFound() if contract version cannot be determined
 */
export const getContestContract = async (address: string, chainId: number): Promise<{ abi: Abi; version: string }> => {
  const { abi, version } = await getContestContractVersion(address, chainId);

  if (!abi || version === "error") {
    throw notFound();
  }

  return { abi: abi as Abi, version };
};

/**
 * Fetches contest details (name and prompt) from the blockchain
 *
 * @returns Contest name and prompt, with fallback values on error
 */
export const fetchContestDetails = async (address: string, chainId: number, abi: Abi): Promise<ContestDetails> => {
  try {
    const contracts = [
      {
        address: address as `0x${string}`,
        abi,
        chainId,
        functionName: "name",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi,
        chainId,
        functionName: "prompt",
        args: [],
      },
    ];

    const results = (await readContracts(config, { contracts })) as [
      { result?: string; status: string },
      { result?: string; status: string },
    ];

    return {
      name: results[0]?.result ?? "",
      prompt: results[1]?.result ?? "||",
    };
  } catch (error) {
    console.error("Failed to fetch contest details:", error);
    return { name: "", prompt: "||" };
  }
};

/**
 * Fetches all contest data for the loader
 * Called directly from the route loader
 *
 * @throws notFound() if chain or contract is invalid
 */
export const getContestData = async (chain: string, address: string): Promise<ContestLoaderData> => {
  // Validate params
  const parseResult = ContestParamsSchema.safeParse({ chain, address });
  if (!parseResult.success) {
    throw notFound();
  }

  // Validate chain and get chainId
  const chainId = validateChain(chain);

  // Get contract ABI and version
  const { abi, version } = await getContestContract(address, chainId);

  // Fetch contest details
  const contestDetails = await fetchContestDetails(address, chainId, abi);

  return {
    address,
    chain,
    chainId,
    abi,
    version,
    contestDetails,
  };
};
