import { chains, config } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getPagination from "@helpers/getPagination";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { getBalance, readContract } from "@wagmi/core";
import { getNetBalances, getPaidBalances } from "lib/rewards";
import moment from "moment";
import { SearchOptions } from "types/search";
import { formatUnits } from "viem";
import { sortContests } from "./utils/sortContests";

export const ITEMS_PER_PAGE = 7;
export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

interface ContestReward {
  contestAddress: string;
  chain: string;
  token: {
    symbol: string;
    value: number;
  } | null;
  winners: number;
  numberOfTokens: number;
  rewardsPaidOut: boolean;
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
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;
  const anyoneCanVote = votingMerkleRoot === EMPTY_ROOT;

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

const processContestRewardsData = async (
  contestAddress: string,
  contestChainName: string,
): Promise<ContestReward | null> => {
  let reward: ContestReward | null = null;

  try {
    const chainId = chains.filter(
      (c: { name: string }) =>
        c.name.replace(/\s+/g, "").toLowerCase() === contestChainName.replace(/\s+/g, "").toLowerCase(),
    )[0].id;

    const contractConfig = await getContractConfig(contestAddress, chainId);

    if (contractConfig && contractConfig.abi?.some((el: { name: string }) => el.name === "officialRewardsModule")) {
      const contestRewardModuleAddress = (await readContract(config, {
        ...contractConfig,
        functionName: "officialRewardsModule",
        args: [],
      })) as string;

      if (contestRewardModuleAddress !== "0x0000000000000000000000000000000000000000") {
        const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, chainId);

        if (abiRewardsModule) {
          const winners = (await readContract(config, {
            address: contestRewardModuleAddress as `0x${string}`,
            abi: abiRewardsModule,
            chainId: chainId,
            functionName: "getPayees",
          })) as bigint[];

          let rewardToken = await fetchNativeBalance(contestRewardModuleAddress, chainId);
          let erc20Tokens: any = null;
          let rewardsPaidOut = false;

          if (!rewardToken || Number(rewardToken.value) === 0) {
            erc20Tokens = await getNetBalances(contestRewardModuleAddress);

            if (erc20Tokens && erc20Tokens.length > 0) {
              rewardToken = await fetchFirstToken(contestRewardModuleAddress, chainId, erc20Tokens[0].tokenAddress);
            }
          }

          if (rewardToken && Number(rewardToken.value) > 0) {
            reward = {
              contestAddress,
              chain: contestChainName,
              token: {
                symbol: rewardToken.symbol,
                value: parseFloat(formatUnits(rewardToken.value, rewardToken.decimals)),
              },
              winners: winners.length,
              numberOfTokens: erc20Tokens?.length ?? 1,
              rewardsPaidOut: rewardsPaidOut,
            };
          } else {
            const paidBalances = await getPaidBalances(contestRewardModuleAddress, true);
            rewardsPaidOut = paidBalances && paidBalances.length > 0;

            reward = {
              contestAddress,
              chain: contestChainName,
              token: null,
              winners: winners.length,
              numberOfTokens: erc20Tokens?.length ?? 0,
              rewardsPaidOut: rewardsPaidOut,
            };
          }
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  return reward;
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
        data.map(contest => processContestQualifications(contest, userAddress ?? "")),
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
      let query = supabase
        .from("contests_v3")
        .select(
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt, submissionMerkleRoot, hidden, votingMerkleRoot, voting_requirements, submission_requirements",
          { count: "exact" },
        )
        .eq("author_address", profileAddress)
        .order("created_at", { ascending: false });

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
        data.map(contest => processContestQualifications(contest, currentUserAddress)),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
      return { data: [], count: 0 };
    }
  }
  return { data: [], count: 0 };
}

export async function getFeaturedContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
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

    processedData = await Promise.all(data.map(contest => processContestQualifications(contest, userAddress ?? "")));

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
        data.map(contest => processContestQualifications(contest, userAddress ?? "")),
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
        data.map(contest => processContestQualifications(contest, userAddress ?? "")),
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
        data.map(contest => processContestQualifications(contest, userAddress ?? "")),
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
      const { data, error } = await supabase
        .from("contests_v3")
        .select("address")
        .eq("address", address)
        .eq("network_name", networkName);
      if (error) {
        throw new Error(error.message);
      }
      return data.length > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return false;
}
