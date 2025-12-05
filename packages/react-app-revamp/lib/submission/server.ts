import { notFound } from "@tanstack/react-router";
import { readContract } from "@wagmi/core";
import type { Abi } from "viem";
import { serverConfig, chains } from "@config/wagmi/server";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { SubmissionParamsSchema } from "./schemas";
import type { SubmissionLoaderData } from "./types";

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
 * Fetches the contest name from the blockchain
 */
export const getContestName = async (address: string, chainId: number, abi: Abi): Promise<string> => {
  try {
    const result = await readContract(serverConfig, {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "name",
    });

    return result as string;
  } catch (error) {
    console.error("Failed to fetch contest name:", error);
    return "contest";
  }
};

/**
 * Fetches all submission data for the loader
 *
 * @throws notFound() if chain, address, or contract is invalid
 */
export const getSubmissionData = async (
  chain: string,
  address: string,
  submission: string,
): Promise<SubmissionLoaderData> => {
  // Validate params
  const parseResult = SubmissionParamsSchema.safeParse({ chain, address, submission });
  if (!parseResult.success) {
    throw notFound();
  }

  // Validate chain and get chainId
  const chainId = validateChain(chain);

  // Get contract ABI and version
  const { abi, version } = await getContestContractVersion(address, chainId);

  if (!abi || version === "error") {
    throw notFound();
  }

  // Fetch contest name for metadata
  const contestName = await getContestName(address, chainId, abi as Abi);

  return {
    address,
    chain,
    submission,
    chainId,
    abi: abi as Abi,
    version,
    contestName,
  };
};
