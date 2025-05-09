import { config } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { getRewardsModuleContractVersion } from "@helpers/getRewardsModuleContractVersion";
import getVoterRewardsModuleContractVersion from "@helpers/getVoterRewardsModuleContractVersion";
import { ContractConfig } from "@hooks/useContest";
import { readContract } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";

export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

enum ModuleType {
  VOTER_REWARDS = "VOTER_REWARDS",
  AUTHOR_REWARDS = "AUTHOR_REWARDS",
}

export const VOTER_REWARDS_VERSION = "5.5";

/**
 * Fetches the list of all ERC20 token addresses associated with a specific rewards module address.
 * This function retrieves unique token addresses from the analytics_rewards_v3 table in the database,
 * filtering by the given rewards module address and network name.
 *
 * @param rewardsModuleAddress address of the rewards module
 * @param networkName name of the chain
 * @returns a Promise that resolves to an array of unique ERC20 token addresses
 */
export const getTokenAddresses = async (rewardsModuleAddress: string, networkName: string): Promise<string[]> => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .eq("rewards_module_address", rewardsModuleAddress)
      .eq("network_name", networkName.toLowerCase())
      .not("token_address", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    const uniqueTokens = new Set(
      tokens
        .map((token: { token_address: string }) => token.token_address)
        .filter((address: string) => address !== "native"),
    );

    return Array.from(uniqueTokens);
  }

  return [];
};

/**
 * Inserts a contest with voting rewards into the database.
 * @param contestAddress contest address
 * @param chainName chain name
 * @returns true if the contest was inserted successfully, false otherwise
 */
export const insertContestWithVotingRewards = async (contestAddress: string, chainName: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const { error } = await supabase
        .from("contests_with_voting_rewards")
        .insert({ chain: chainName.toLowerCase(), address: contestAddress });

      if (error) {
        console.error("Error inserting contest with voting rewards:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to insert contest with voting rewards:", error);
      return false;
    }
  }

  return false;
};

export async function getRewardsModuleAbi(rewardsModuleAddress: string, chainId: number): Promise<Abi | null> {
  try {
    try {
      const { abi, version } = await getRewardsModuleVersionInfo(rewardsModuleAddress, chainId);

      if (!abi) return null;
      if (compareVersions(version, VOTER_REWARDS_VERSION) < 0) {
        return abi as Abi;
      }

      const moduleType = await getModuleType(rewardsModuleAddress, abi as Abi, chainId);

      if (moduleType === ModuleType.VOTER_REWARDS) {
        return (await getVoterRewardsModuleContractVersion(rewardsModuleAddress, chainId)) as Abi;
      } else {
        return abi as Abi;
      }
    } catch (error) {
      console.error("Error getting module info:", error);
      return null;
    }
  } catch (error) {
    console.error("Error in getRewardsModuleAbi:", error);
    return null;
  }
}

export async function getRewardsModuleVersionInfo(address: string, chainId: number) {
  return await getRewardsModuleContractVersion(address, chainId);
}

export async function getRewardsModuleAddress(contractConfig: ContractConfig): Promise<string | null> {
  const hasRewardsModule = contractConfig.abi?.some((el: { name: string }) => el.name === "officialRewardsModule");

  if (!hasRewardsModule) return null;

  const address = (await readContract(config, {
    ...contractConfig,
    functionName: "officialRewardsModule",
    args: [],
  })) as string;

  return address === "0x0000000000000000000000000000000000000000" ? null : address;
}

export async function getModuleType(address: string, abi: Abi, chainId: number): Promise<string> {
  return (await readContract(config, {
    address: address as `0x${string}`,
    abi,
    functionName: "MODULE_TYPE",
    chainId,
    args: [],
  })) as string;
}
