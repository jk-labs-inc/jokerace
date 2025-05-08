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

export async function getRewardsModuleAbi(contractConfig: ContractConfig): Promise<Abi | null> {
  const moduleAddress = await getRewardsModuleAddress(contractConfig);
  if (!moduleAddress) return null;

  const { abi, version } = await getRewardsModuleVersionInfo(moduleAddress, contractConfig.chainId);
  if (!abi) return null;

  if (compareVersions(version, VOTER_REWARDS_VERSION) < 0) {
    return abi as Abi;
  }

  const moduleType = await getModuleType(moduleAddress, abi as Abi, contractConfig.chainId);

  return moduleType === ModuleType.VOTER_REWARDS
    ? ((await getVoterRewardsModuleContractVersion(moduleAddress, contractConfig.chainId)) as Abi)
    : (abi as Abi);
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
