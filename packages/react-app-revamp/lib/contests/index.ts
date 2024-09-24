import { chains, config } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getPagination from "@helpers/getPagination";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { getBalance, getToken, readContract, readContracts } from "@wagmi/core";
import { getTokenAddresses } from "lib/rewards";
import moment from "moment";
import { SearchOptions } from "types/search";
import { Abi, erc20Abi, formatUnits } from "viem";
import { sortContests } from "./utils/sortContests";
import { formatBalance } from "@helpers/formatBalance";
import { ContestStateEnum } from "@hooks/useContestState/store";

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

const fetchParticipantData = async (contestAddress: string, userAddress: string, networkName: string) => {
  const config = await import("@config/supabase");
  const supabase = config.supabase;

  const { data } = await supabase
    .from("contest_participants_v3")
    .select("can_submit, num_votes")
    .eq("user_address", userAddress)
    .eq("contest_address", contestAddress)
    .eq("network_name", networkName);

  return data && data.length > 0 ? data[0] : null;
};

const updateContestWithUserQualifications = async (contest: any, userAddress: string) => {
  const { submissionMerkleRoot, network_name, address, votingMerkleRoot } = contest;
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_HASH;
  const anyoneCanVote = votingMerkleRoot === EMPTY_HASH;

  let participantData = { can_submit: anyoneCanSubmit, num_votes: 0 };
  if (userAddress) {
    const fetchedData = await fetchParticipantData(address, userAddress, network_name);
    participantData = fetchedData ? fetchedData : participantData;
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
          value: formatBalance(formatUnits(nativeReleasable, chain.nativeCurrency.decimals)),
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
            value: formatBalance(formatUnits(erc20Releasable, tokenDetails.decimals)),
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

  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      let query = supabase
        .from(table)
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        )
        .textSearch(searchColumn, `${searchString}`, {
          type: "websearch",
          config: language,
        })
        .eq("hidden", false);

      if (sortBy) {
        query = sortContests(query, sortBy);
      }

      query = query.range(from, to).order(orderBy, { ascending });

      const result = await query;

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(
        data.map(async contest => {
          const processedContest = await processContestQualifications(contest, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
          };
        }),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
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
  if (isSupabaseConfigured && profileAddress) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);

    try {
      const executeQuery = async (useIlike: boolean) => {
        let query = supabase
          .from("contests_v3")
          .select(
            "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, hidden, votingMerkleRoot, voting_requirements, submission_requirements",
            { count: "exact" },
          );

        if (useIlike) {
          query = query.ilike("author_address", profileAddress);
        } else {
          query = query.eq("author_address", profileAddress);
        }
        query = query.order("created_at", { ascending: false });

        if (sortBy) {
          query = sortContests(query, sortBy);
        }
        return query.range(from, to);
      };

      // first attempt with eq
      let result = await executeQuery(false);

      // if no results, it could be that address is lowercase, try with ilike
      if (result.data?.length === 0) {
        result = await executeQuery(true);
      }

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(
        data.map(async contest => {
          const processedContest = await processContestQualifications(contest, currentUserAddress);
          return {
            ...processedContest,
            isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
          };
        }),
      );

      return { data: processedData, count: count ?? 0 };
    } catch (e) {
      console.error(e);
      return { data: [], count: 0 };
    }
  }
  return { data: [], count: 0 };
}

export async function getFeaturedContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
): Promise<{ data: Contest[]; count: number | null }> {
  if (!isSupabaseConfigured) return { data: [], count: 0 };

  const config = await import("@config/supabase");
  const { from, to } = getPagination(currentPage, itemsPerPage);
  let processedData = [];

  try {
    const { data, count, error } = await config.supabase
      .from("contests_v3")
      .select(
        "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
        { count: "exact" },
      )
      .is("featured", true)
      .range(from, to);

    if (error) throw new Error(error.message);

    processedData = await Promise.all(
      data.map(async contest => {
        const processedContest = await processContestQualifications(contest, userAddress ?? "");
        return {
          ...processedContest,
          isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
        };
      }),
    );

    processedData.sort((a, b) => {
      const now = moment();
      const aIsHappening = moment(a.created_at).isBefore(now) && moment(a.end_at).isAfter(now);
      const bIsHappening = moment(b.created_at).isBefore(now) && moment(b.end_at).isAfter(now);

      // both are happening, sort by nearest end date. we could have a 'order' column in the future
      if (aIsHappening && bIsHappening) {
        return moment(a.end_at).diff(now) - moment(b.end_at).diff(now);
      }

      // only one is happening, it comes first
      if (aIsHappening) return -1;
      if (bIsHappening) return 1;

      // none are happening, sort by nearest start date
      return moment(a.created_at).diff(now) - moment(b.created_at).diff(now);
    });

    return { data: processedData, count };
  } catch (e) {
    console.error(e);
    return { data: [], count: 0 };
  }
}

export async function getLiveContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
  sortBy?: string,
) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      let query = supabase
        .from("contests_v3")
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        )
        .eq("hidden", false)
        .lte("start_at", new Date().toISOString())
        .gte("end_at", new Date().toISOString());

      if (sortBy) {
        query = sortContests(query, sortBy);
      }

      query = query.range(from, to);

      const result = await query;

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(
        data.map(async contest => {
          const processedContest = await processContestQualifications(contest, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
          };
        }),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
      return { data: [], count: 0 };
    }
  }
}

export async function getPastContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests_v3")
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        )
        .eq("hidden", false)
        .lt("end_at", new Date().toISOString())
        .order("end_at", { ascending: false })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(
        data.map(async contest => {
          const processedContest = await processContestQualifications(contest, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
          };
        }),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
    return { data: [], count: 0 };
  }
}

export async function getUpcomingContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
  sortBy?: string,
) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);

    try {
      let query = supabase
        .from("contests_v3")
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        )
        .eq("hidden", false)
        .gt("start_at", new Date().toISOString());

      if (sortBy) {
        query = sortContests(query, sortBy);
      } else {
        query = query.order("start_at", { ascending: false });
      }

      query = query.range(from, to);

      const result = await query;
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(
        data.map(async contest => {
          const processedContest = await processContestQualifications(contest, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled: await checkIfContestIsCanceled(processedContest.address, processedContest.network_name),
          };
        }),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
      return { data: [], count: 0 };
    }
  }
  return { data: [], count: 0 };
}

export async function checkIfContestExists(address: string, networkName: string) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    try {
      let { data, error } = await supabase
        .from("contests_v3")
        .select("address")
        .eq("address", address.toLowerCase())
        .eq("network_name", networkName);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        return true;
      }

      ({ data, error } = await supabase
        .from("contests_v3")
        .select("address")
        .eq("address", address)
        .eq("network_name", networkName));

      if (error) {
        throw new Error(error.message);
      }

      return data ? data.length > 0 : false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return false;
}
