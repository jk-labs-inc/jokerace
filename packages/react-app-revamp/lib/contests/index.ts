import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getPagination from "@helpers/getPagination";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { alchemyRpcUrls, fetchBalance, FetchBalanceResult, readContract, readContracts } from "@wagmi/core";
import { BigNumber, ethers, utils } from "ethers";
import { fetchUserBalance } from "lib/fetchUserBalance";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import moment from "moment";
import { SearchOptions } from "types/search";

export const ITEMS_PER_PAGE = 7;

async function getContractConfig(address: string, chainName: string, chainId: number) {
  const { abi, version } = await getContestContractVersion(address, chainName);

  if (abi === null) {
    return;
  }

  const contractConfig = {
    addressOrName: address,
    contractInterface: abi,
    chainId: chainId,
  };

  return contractConfig;
}

const fetchTokenBalances = async (contest: any, contestRewardModuleAddress: string) => {
  try {
    const networkName = contest.network_name.toLowerCase() === "arbitrumone" ? "arbitrum" : contest.network_name;
    const alchemyRpc = Object.keys(alchemyRpcUrls).filter(url => url.toLowerCase() === networkName)[0];
    //@ts-ignore
    const alchemyAppUrl = `${alchemyRpcUrls[alchemyRpc]}/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
    const response = await fetch(alchemyAppUrl, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        headers: {
          "Content-Type": "application/json",
        },
        params: [`${contestRewardModuleAddress}`, "erc20"],
        id: 42,
      }),
      redirect: "follow",
    });
    const asJson = await response.json();

    const balance = asJson.result?.tokenBalances?.filter((token: any) => {
      const tokenBalance = ethers.BigNumber.from(token["tokenBalance"]);
      return tokenBalance.gt(0);
    });

    return balance;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    return null;
  }
};

const fetchNativeBalance = async (contestRewardModuleAddress: string, chainId: number) => {
  try {
    const nativeBalance = await fetchBalance({
      addressOrName: contestRewardModuleAddress.toString(),
      chainId: chainId,
    });
    return nativeBalance;
  } catch (error) {
    console.error("Error fetching native balance:", error);
    return null;
  }
};

const fetchFirstToken = async (contestRewardModuleAddress: string, chainId: number, tokenAddress: string) => {
  try {
    const firstToken = await fetchBalance({
      addressOrName: contestRewardModuleAddress.toString(),
      chainId: chainId,
      token: tokenAddress,
    });
    return firstToken;
  } catch (error) {
    console.error("Error fetching first token balance:", error);
    return null;
  }
};

const processContestData = async (contest: any, userAddress: string) => {
  try {
    const chain = chains.find(
      c => c.name.replace(/\s+/g, "").toLowerCase() === contest.network_name.replace(/\s+/g, "").toLowerCase(),
    );

    const contractConfig = await getContractConfig(contest.address, contest.network_name, chain?.id ?? 0);

    let votersSet = new Set(contest.votingMerkleTree.voters.map((voter: Recipient) => voter.address));

    contest.qualifiedToVote = votersSet.has(userAddress);

    if (contest.submissionMerkleTree) {
      const submittersSet = new Set(
        contest.submissionMerkleTree.submitters.map((submitter: Recipient) => submitter.address),
      );
      contest.qualifiedToSubmit = submittersSet.has(userAddress);
    } else {
      contest.anyoneCanSubmit = true;
    }

    if (
      contractConfig &&
      //@ts-ignore
      contractConfig.contractInterface?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0
    ) {
      try {
        const contestRewardModuleAddress = await readContract({
          ...contractConfig,
          functionName: "officialRewardsModule",
        });

        if (contestRewardModuleAddress.toString() === "0x0000000000000000000000000000000000000000") {
          contest.rewards = null;
        } else {
          const abiRewardsModule = await getRewardsModuleContractVersion(
            contestRewardModuleAddress.toString(),
            contest.network_name,
          );

          if (!abiRewardsModule) {
            contest.rewards = null;
          } else {
            const winners = await readContract({
              addressOrName: contestRewardModuleAddress.toString(),
              contractInterface: abiRewardsModule,
              chainId: chain?.id,
              functionName: "getPayees",
            });

            let rewardToken: FetchBalanceResult | null = null;
            let erc20Tokens: any = null;

            rewardToken = await fetchNativeBalance(contestRewardModuleAddress.toString(), chain?.id ?? 0);

            if (!rewardToken || rewardToken.value.eq(0)) {
              try {
                erc20Tokens = await fetchTokenBalances(contest, contestRewardModuleAddress.toString());

                if (erc20Tokens && erc20Tokens.length > 0) {
                  rewardToken = await fetchFirstToken(
                    contestRewardModuleAddress.toString(),
                    chain?.id ?? 0,
                    erc20Tokens[0].contractAddress,
                  );
                }
              } catch (error) {
                console.error("Error fetching token balances:", error);
                return;
              }
            }

            if (rewardToken) {
              contest.rewards = {
                token: {
                  symbol: rewardToken.symbol,
                  value: parseFloat(utils.formatUnits(rewardToken.value, rewardToken.decimals)),
                },
                winners: winners.length,
                numberOfTokens: erc20Tokens?.length ?? 1,
              };
            } else {
              contest.rewards = null;
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        contest.rewards = null;
      }
    } else {
      contest.rewards = null;
    }

    return contest;
  } catch (error) {
    console.error("Error processing contest data:", error);
    return {
      ...contest,
      rewards: null,
      qualifiedToVote: false,
      qualifiedToSubmit: false,
    };
  }
};

// Search for contests based on the search options provided, table is contests by default and column is title by default
export async function searchContests(options: SearchOptions = {}, userAddress?: string) {
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
      const result = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .textSearch(searchColumn, `${searchString}`, {
          type: "websearch",
          config: language,
        })
        .range(from, to)
        .order(orderBy, { ascending });

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(data.map(contest => processContestData(contest, userAddress ?? "")));
      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getFeaturedContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
  if (!isSupabaseConfigured) return { data: [], count: 0 };

  const config = await import("@config/supabase");
  const { from, to } = getPagination(currentPage, itemsPerPage);

  try {
    const { data, count, error } = await config.supabase
      .from("contests_v3")
      .select("*", { count: "exact" })
      .is("featured", true)
      .range(from, to);

    if (error) throw new Error(error.message);

    const processedData = await Promise.all(data.map(contest => processContestData(contest, userAddress ?? "")));

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

export async function getLiveContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests_v3")
        .select("*", { count: "exact" })
        .lte("start_at", new Date().toISOString())
        .gte("end_at", new Date().toISOString())
        .order("end_at", { ascending: true })
        .range(from, to);

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(data.map(contest => processContestData(contest, userAddress ?? "")));

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
    return { data: [], count: 0 };
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
        .select("*", { count: "exact" })
        // all rows whose votes end date is < to the current date.
        .lt("end_at", new Date().toISOString())
        .order("end_at", { ascending: false })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(data.map(contest => processContestData(contest, userAddress ?? "")));
      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
    return { data: [], count: 0 };
  }
}

export async function getUpcomingContests(currentPage: number, itemsPerPage: number, userAddress?: string) {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("contests_v3")
        .select("*", { count: "exact" })
        // all rows whose submissions start date is > to the current date.
        .gt("start_at", new Date().toISOString())
        .order("start_at", { ascending: false })
        .range(from, to);
      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      const processedData = await Promise.all(data.map(contest => processContestData(contest, userAddress ?? "")));
      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
    return { data: [], count: 0 };
  }
}
