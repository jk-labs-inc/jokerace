import { chains, config } from "@config/wagmi";
import { formatBalance } from "@helpers/formatBalance";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { getBalance, readContract, readContracts } from "@wagmi/core";
import { getRewardsModuleInfo } from "lib/rewards/contracts";
import { getTokenAddresses } from "lib/rewards/database";
import { Abi, erc20Abi, formatUnits } from "viem";
import { ContestReward } from "./types";

export const EMPTY_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Get contract config for a given address and chainId
 * @param address Contract address
 * @param chainId Chain ID
 * @returns Contract config
 */
async function getContractConfig(address: string, chainId: number) {
  const { abi } = await getContestContractVersion(address, chainId);

  if (abi === null) {
    return;
  }

  const contractConfig = {
    address: address as `0x${string}`,
    abi: abi as any,
    chainId: chainId,
  };

  return contractConfig;
}

/**
 * Get contest title and state in a single batch of contract calls
 * @param contestAddress Contract address
 * @param networkName Network name
 * @returns Object containing title and isCanceled status
 */
export async function getContestTitleAndState(
  contestAddress: string,
  networkName: string,
): Promise<{ title: string | null; isCanceled: boolean }> {
  const chainId = chains.find(c => c.name.toLowerCase() === networkName.toLowerCase())?.id;
  if (!chainId) return { title: null, isCanceled: false };

  try {
    const contractConfig = await getContractConfig(contestAddress, chainId);
    if (!contractConfig) {
      return { title: null, isCanceled: false };
    }

    const results = await readContracts(config, {
      contracts: [
        {
          ...contractConfig,
          functionName: "name",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "state",
          args: [],
        },
      ],
    });

    const title = results[0].result as string;
    const state = results[1].result;
    const isCanceled = state === ContestStateEnum.Canceled;

    return { title, isCanceled };
  } catch (error) {
    console.error("Error fetching contest data:", error);
    return { title: null, isCanceled: false };
  }
}

export async function fetchNativeBalance(contestRewardModuleAddress: string, chainId: number) {
  try {
    const nativeBalance = await getBalance(config, {
      address: contestRewardModuleAddress as `0x${string}`,
      chainId: chainId,
    });
    return nativeBalance;
  } catch (error) {
    console.error("Error fetching native balance:", error);
    return null;
  }
}

export async function fetchFirstToken(contestRewardModuleAddress: string, chainId: number, tokenAddress: string) {
  try {
    const firstToken = await getBalance(config, {
      address: contestRewardModuleAddress as `0x${string}`,
      chainId: chainId,
      token: tokenAddress as `0x${string}`,
    });
    return firstToken;
  } catch (error) {
    console.error("Error fetching first token balance:", error);
    return null;
  }
}

export async function getTokenDetails(tokenAddress: string, chainId: number) {
  try {
    const result = await readContracts(config, {
      contracts: [
        {
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "symbol",
          chainId,
        },
        {
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
          chainId,
        },
      ],
    });

    return {
      symbol: result[0].result as string,
      decimals: result[1].result as number,
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    return { symbol: "Unknown", decimals: 18 };
  }
}

export async function processContestRewardsData(
  contestAddress: string,
  contestChainName: string,
): Promise<ContestReward | null> {
  try {
    const chain = chains.find(
      c => c.name.replace(/\s+/g, "").toLowerCase() === contestChainName.replace(/\s+/g, "").toLowerCase(),
    );
    if (!chain) throw new Error("Chain not found");

    const contractConfig = await getContractConfig(contestAddress, chain.id);
    if (!contractConfig || !contractConfig.abi?.some((el: { name: string }) => el.name === "officialRewardsModule")) {
      return null;
    }

    const rewardsModuleAddress = (await readContract(config, {
      ...contractConfig,
      functionName: "officialRewardsModule",
      args: [],
    })) as string;

    if (rewardsModuleAddress === EMPTY_ADDRESS || rewardsModuleAddress === EMPTY_HASH) return null;

    const { abi: abiRewardsModule, moduleType } = await getRewardsModuleInfo(rewardsModuleAddress, chain.id);
    if (!abiRewardsModule) return null;

    const [winners, erc20TokenAddresses] = await Promise.all([
      readContract(config, {
        address: rewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        chainId: chain.id,
        functionName: "getPayees",
      }) as Promise<bigint[]>,
      getTokenAddresses(rewardsModuleAddress, contestChainName),
    ]);

    if (!winners.length) return null;

    const checkReleasableAndReleased = async (isNative: boolean, tokenAddress?: string) => {
      const [releasableAmounts, releasedAmounts] = await Promise.all([
        readContracts(config, {
          contracts: winners.map(ranking => ({
            address: rewardsModuleAddress as `0x${string}`,
            abi: abiRewardsModule as Abi,
            chainId: chain.id,
            functionName: "releasable",
            args: isNative ? [ranking] : [tokenAddress, ranking],
          })),
        }),
        readContracts(config, {
          contracts: winners.map(ranking => ({
            address: rewardsModuleAddress as `0x${string}`,
            abi: abiRewardsModule as Abi,
            chainId: chain.id,
            functionName: isNative ? "released" : "erc20Released",
            args: isNative ? [ranking] : [tokenAddress, ranking],
          })),
        }),
      ]);

      const totalReleasable = releasableAmounts.reduce((sum, amount) => sum + BigInt(amount.result as string), 0n);
      const totalReleased = releasedAmounts.reduce((sum, amount) => sum + BigInt(amount.result as string), 0n);

      return { totalReleasable, totalReleased };
    };

    // check native token first
    const { totalReleasable: nativeReleasable, totalReleased: nativeReleased } = await checkReleasableAndReleased(true);

    if (nativeReleasable > 0n) {
      return {
        contestAddress,
        chain: contestChainName,
        token: {
          symbol: chain.nativeCurrency.symbol,
          //TODO: fix output
          value: formatBalance(formatUnits(nativeReleasable, chain.nativeCurrency.decimals).toString()),
        },
        winners: winners.length,
        numberOfTokens: 1,
        rewardsPaidOut: false,
      };
    }

    if (nativeReleased > 0n) {
      return {
        contestAddress,
        chain: contestChainName,
        token: null,
        winners: winners.length,
        numberOfTokens: 1,
        rewardsPaidOut: true,
      };
    }

    for (const tokenAddress of erc20TokenAddresses) {
      const { totalReleasable: erc20Releasable, totalReleased: erc20Released } = await checkReleasableAndReleased(
        false,
        tokenAddress,
      );

      if (erc20Releasable > 0n) {
        const tokenDetails = await getTokenDetails(tokenAddress, chain.id);
        return {
          contestAddress,
          chain: contestChainName,
          token: {
            symbol: tokenDetails.symbol ?? "",
            //TODO: fix output
            value: formatBalance(formatUnits(erc20Releasable, tokenDetails.decimals).toString()),
          },
          winners: winners.length,
          numberOfTokens: erc20TokenAddresses.length,
          rewardsPaidOut: false,
        };
      }

      if (erc20Released > 0n) {
        return {
          contestAddress,
          chain: contestChainName,
          token: null,
          winners: winners.length,
          numberOfTokens: erc20TokenAddresses.length,
          rewardsPaidOut: true,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
