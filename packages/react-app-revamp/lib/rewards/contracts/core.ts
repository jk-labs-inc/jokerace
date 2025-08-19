import { chains, config } from "@config/wagmi";
import { getRewardsModuleContractVersion } from "@helpers/getRewardsModuleContractVersion";
import getVoterRewardsModuleContractVersion from "@helpers/getVoterRewardsModuleContractVersion";
import { ContractConfig } from "@hooks/useContest";
import { readContract } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { ModuleType, RewardsModuleInfo, VOTER_REWARDS_VERSION } from "../types";

/**
 * Gets information about the rewards module
 * @param rewardsModuleAddress address of the rewards module
 * @param chainId chain ID
 * @returns rewards module information
 */
export async function getRewardsModuleInfo(rewardsModuleAddress: string, chainId: number): Promise<RewardsModuleInfo> {
  try {
    const { abi, version } = await getRewardsModuleVersionInfo(rewardsModuleAddress, chainId);

    if (!abi) return { abi: null, moduleType: null };

    let finalAbi: Abi | null = abi as Abi;

    if (compareVersions(version, VOTER_REWARDS_VERSION) < 0) {
      return { abi: finalAbi, moduleType: ModuleType.AUTHOR_REWARDS };
    }

    const moduleType = await getModuleType(rewardsModuleAddress, abi as Abi, chainId);

    if (moduleType === ModuleType.VOTER_REWARDS) {
      finalAbi = (await getVoterRewardsModuleContractVersion(rewardsModuleAddress, chainId)) as Abi;
    }

    return {
      abi: finalAbi,
      moduleType: moduleType as ModuleType,
    };
  } catch (error) {
    console.error("Error in getRewardsModuleInfo:", error);
    return { abi: null, moduleType: null };
  }
}

/**
 * Gets rewards module version information
 * @param address address of the rewards module
 * @param chainId chain ID
 * @returns version information
 */
export async function getRewardsModuleVersionInfo(address: string, chainId: number) {
  return await getRewardsModuleContractVersion(address, chainId);
}

/**
 * Gets the rewards module address for a contest
 * @param contractConfig contest contract config
 * @returns rewards module address
 */
export async function getRewardsModuleAddress(contractConfig: ContractConfig): Promise<string | null> {
  try {
    const hasRewardsModule = contractConfig.abi?.some((el: { name: string }) => el.name === "officialRewardsModule");

    if (!hasRewardsModule) return null;

    const address = (await readContract(config, {
      ...contractConfig,
      functionName: "officialRewardsModule",
      args: [],
    })) as string;

    return address === "0x0000000000000000000000000000000000000000" ? null : address;
  } catch (error) {
    console.error("Error getting rewards module address:", error);
    return null;
  }
}

/**
 * Gets the module type
 * @param address address of the rewards module
 * @param abi ABI of the rewards module
 * @param chainId chain ID
 * @returns module type
 */
export async function getModuleType(address: string, abi: Abi, chainId: number): Promise<string> {
  try {
    return (await readContract(config, {
      address: address as `0x${string}`,
      abi,
      functionName: "MODULE_TYPE",
      chainId,
      args: [],
    })) as string;
  } catch (error) {
    console.error("Error getting module type:", error);
    return "UNKNOWN";
  }
}
