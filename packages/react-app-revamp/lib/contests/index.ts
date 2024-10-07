import { chains, config } from "@config/wagmi";
import { formatBalance } from "@helpers/formatBalance";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { getBalance, readContract, readContracts } from "@wagmi/core";
import { getTokenAddresses } from "lib/rewards";
import { SearchOptions } from "types/search";
import { Abi, erc20Abi, formatUnits } from "viem";

export const ITEMS_PER_PAGE = 7;
export const EMPTY_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface ContestReward {
  contestAddress: string;
  chain: string;
  token: {
    symbol: string;
    value: string;
  } | null;
  winners: number;
  numberOfTokens: number;
  rewardsPaidOut: boolean;
}

export interface Contest {
  created_at: string;
  start_at: string | null;
  end_at: string | null;
  address: string | null;
  author_address: string | null;
  network_name: string | null;
  vote_start_at: string | null;
  featured: boolean | null;
  title: string | null;
  type: string | null;
  summary: string | null;
  prompt: string | null;
  votingMerkleRoot: string | null;
  submissionMerkleRoot: string | null;
  hidden: boolean;
  voting_requirements: Record<string, any> | null;
  submission_requirements: Record<string, any> | null;
  cost_to_propose: number | null;
  percentage_to_propose: number | null;
  cost_to_vote: number | null;
  isCanceled: boolean;
}

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

async function checkIfContestIsCanceled(contestAddress: string, networkName: string): Promise<boolean> {
  const chainId = chains.find(c => c.name.toLowerCase() === networkName.toLowerCase())?.id;
  if (!chainId) return false;

  try {
    const contractConfig = await getContractConfig(contestAddress, chainId);
    if (!contractConfig) {
      return false;
    }

    const state = await readContract(config, {
      ...contractConfig,
      functionName: "state",
      args: [],
    });

    return state === ContestStateEnum.Canceled;
  } catch (error) {
    console.error("Error checking if contest is canceled:", error);
    return false;
  }
}

export const fetchNativeBalance = async (contestRewardModuleAddress: string, chainId: number) => {
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
};

export const fetchFirstToken = async (contestRewardModuleAddress: string, chainId: number, tokenAddress: string) => {
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
};

const updateContestWithUserQualifications = async (contest: any, userAddress: string) => {
  const { submissionMerkleRoot, network_name, address, votingMerkleRoot } = contest;
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_HASH;
  const anyoneCanVote = votingMerkleRoot === EMPTY_HASH;

  let participantData = { can_submit: anyoneCanSubmit, num_votes: 0 };
  if (userAddress) {
    try {
      const response = await fetch(
        `/api/contests/participant-data?contestAddress=${address}&userAddress=${userAddress}&networkName=${network_name}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch participant data");
      }
      const fetchedData = await response.json();
      participantData = fetchedData ? fetchedData : participantData;
    } catch (error) {
      console.error("Error fetching participant data:", error);
      // fallback to default participantData if fetch fails
    }
  }

  const updatedContest = {
    ...contest,
    anyoneCanSubmit: anyoneCanSubmit,
    anyoneCanVote: anyoneCanVote,
    qualifiedToSubmit: !anyoneCanSubmit ? participantData.can_submit : undefined,
    qualifiedToVote: !anyoneCanVote ? participantData.num_votes > 0 : undefined,
  };

  return updatedContest;
};

async function getTokenDetails(tokenAddress: string, chainId: number) {
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

const processContestRewardsData = async (
  contestAddress: string,
  contestChainName: string,
): Promise<ContestReward | null> => {
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

    if (rewardsModuleAddress === EMPTY_HASH) return null;

    const abiRewardsModule = await getRewardsModuleContractVersion(rewardsModuleAddress, chain.id);
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

    // 0check ERC20 tokens
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
};

const processContestQualifications = async (contest: any, userAddress: string) => {
  try {
    return await updateContestWithUserQualifications(contest, userAddress);
  } catch (error) {
    console.error("Error processing contest qualifications:", error);
    return {
      ...contest,
      rewards: null,
      qualifiedToVote: false,
      qualifiedToSubmit: false,
    };
  }
};

// Search for contests based on the search options provided, table is contests by default and column is title by default
export async function searchContests(options: SearchOptions = {}, userAddress?: string, sortBy?: string) {
  const {
    searchColumn = "title",
    searchString = "",
    pagination = { currentPage: 1, itemsPerPage: ITEMS_PER_PAGE },
    sorting = { orderBy: "created_at", ascending: false },
    table = "contests_v3",
    language = "english",
  } = options;

  const { currentPage = 1, itemsPerPage = ITEMS_PER_PAGE } = pagination;
  const { orderBy = "created_at", ascending = false } = sorting;

  try {
    const params = new URLSearchParams({
      searchColumn,
      searchString,
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
      orderBy,
      ascending: ascending.toString(),
      table,
      language,
      sortBy: sortBy || "",
    });

    const response = await fetch(`/api/contests/search?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to fetch search results");
    }

    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: any) => {
        const processedContest = await processContestQualifications(contest, userAddress ?? "");
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    return { data: processedData, count };
  } catch (error) {
    console.error("error searching contests:", error);
    return { data: [], count: 0 };
  }
}

export async function getRewards(contests: any[]) {
  return Promise.all(contests.map(contest => processContestRewardsData(contest.address, contest.network_name)));
}

export async function getUserContests(
  currentPage: number,
  itemsPerPage: number,
  profileAddress: string,
  currentUserAddress: string,
  sortBy?: string,
) {
  try {
    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
      profileAddress,
      ...(sortBy && { sortBy }),
    });

    const response = await fetch(`/api/user/contests?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to fetch user contests");
    }

    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: any) => {
        const processedContest = await processContestQualifications(contest, currentUserAddress);
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    return { data: processedData, count };
  } catch (error) {
    console.error("Error fetching user contests:", error);
    return { data: [], count: 0 };
  }
}

export async function getFeaturedContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
): Promise<{ data: Contest[]; count: number | null }> {
  try {
    const response = await fetch(`/api/contests/featured?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch featured contests");
    }
    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: Contest) => {
        const processedContest = await updateContestWithUserQualifications(contest, userAddress ?? "");

        const isCanceled = await checkIfContestIsCanceled(processedContest.address, processedContest.network_name);

        return {
          ...processedContest,
          isCanceled,
        };
      }),
    );

    return { data: processedData, count };
  } catch (e) {
    console.error("Error fetching featured contests:", e);
    return { data: [], count: 0 };
  }
}

export async function getLiveContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
  sortBy?: string,
) {
  try {
    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
      sortBy: sortBy || "",
    });

    const response = await fetch(`/api/contests/live?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to fetch live contests");
    }

    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: any) => {
        const processedContest = await processContestQualifications(contest, userAddress ?? "");
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    return { data: processedData, count };
  } catch (error) {
    console.error("error fetching live contests:", error);
    return { data: [], count: 0 };
  }
}

export async function getPastContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
  try {
    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
    });

    const response = await fetch(`/api/contests/past?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to fetch past contests");
    }

    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: any) => {
        const processedContest = await processContestQualifications(contest, userAddress ?? "");
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    return { data: processedData, count };
  } catch (error) {
    console.error("error fetching past contests:", error);
    return { data: [], count: 0 };
  }
}

export async function getUpcomingContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
  sortBy?: string,
) {
  try {
    const params = new URLSearchParams({
      currentPage: currentPage.toString(),
      itemsPerPage: itemsPerPage.toString(),
      sortBy: sortBy || "",
    });

    const response = await fetch(`/api/contests/upcoming?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to fetch upcoming contests");
    }

    const { data, count } = await response.json();

    const processedData = await Promise.all(
      data.map(async (contest: any) => {
        const processedContest = await processContestQualifications(contest, userAddress ?? "");
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    return { data: processedData, count };
  } catch (error) {
    console.error("error fetching upcoming contests:", error);
    return { data: [], count: 0 };
  }
}

export async function checkIfContestExists(address: string, networkName: string) {
  try {
    const params = new URLSearchParams({
      address,
      networkName,
    });

    const response = await fetch(`/api/contest-exists?${params}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to check if contest exists");
    }

    const { exists } = await response.json();
    return exists;
  } catch (error) {
    console.error("error checking if contest exists:", error);
    return false;
  }
}
