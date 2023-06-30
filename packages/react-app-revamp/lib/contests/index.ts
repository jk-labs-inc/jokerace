import { chains } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getPagination from "@helpers/getPagination";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { alchemyRpcUrls, fetchBalance, readContract, readContracts } from "@wagmi/core";
import { BigNumber } from "ethers";
import { fetchUserBalance } from "lib/fetchUserBalance";
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
    const alchemyRpc = Object.keys(alchemyRpcUrls).filter(url => url.toLowerCase() === contest.network_name)[0];
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
    // Remove tokens with zero balance
    const balance = asJson.result?.tokenBalances?.filter((token: any) => {
      return token["tokenBalance"] !== "0";
    });

    return balance;
  } catch (error) {
    console.error("Error fetching token balances:", error);
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

const fetchBalances = async (userAddress: string, chainId: number, contest: any, contractConfig: any) => {
  const submissionContracts = [
    {
      ...contractConfig,
      functionName: "submissionGatingByVotingToken",
    },
    {
      ...contractConfig,
      functionName: "proposalThreshold",
    },
  ];

  const handleFetchUserBalanceError = (error: any, context: string) => {
    console.error(`Error fetching user balance ${context}:`, error);
    return { value: BigNumber.from(0) };
  };

  if (!userAddress) {
    const submissionData = await readContracts({ contracts: submissionContracts });
    return {
      submissionGatingByVotingToken: submissionData[0] && submissionData[1].gt(0),
      qualifiedToVote: false,
      qualifiedToSubmit: false,
    };
  }

  try {
    const submissionData = await readContracts({ contracts: submissionContracts });

    const [balanceToVote, balanceToSubmit] = await Promise.all([
      fetchUserBalance(userAddress, chainId, contest.token_address).catch(error =>
        handleFetchUserBalanceError(error, "to vote"),
      ),
      fetchUserBalance(
        userAddress,
        chainId,
        submissionData[0] && submissionData[1].gt(0) ? contest.token_address : null,
      ).catch(error => handleFetchUserBalanceError(error, "to submit")),
    ]);

    return {
      submissionGatingByVotingToken: submissionData[0] && submissionData[1].gt(0),
      qualifiedToVote: balanceToVote.value.gt(0),
      qualifiedToSubmit: submissionData[0] && submissionData[1].gt(0) ? balanceToSubmit.value.gt(0) : true,
    };
  } catch (error) {
    console.error("Error fetching balances:", error);
    return {
      submissionGatingByVotingToken: false,
      qualifiedToVote: false,
      qualifiedToSubmit: false,
    };
  }
};

const processContestData = async (contest: any, userAddress: string) => {
  try {
    const chain = chains.find(
      c => c.name.replace(/\s+/g, "").toLowerCase() === contest.network_name.replace(/\s+/g, "").toLowerCase(),
    );

    const contractConfigPromise = getContractConfig(contest.address, contest.network_name, chain?.id ?? 0).catch(
      error => {
        console.error("Error getting contract config:", error);
        return null;
      },
    );

    const [contractConfig, balances] = await Promise.all([
      contractConfigPromise,
      fetchBalances(userAddress, chain?.id ?? 0, contest, await contractConfigPromise),
    ]);

    contest.submissionGatingByVotingToken = balances.submissionGatingByVotingToken;
    contest.qualifiedToVote = balances.qualifiedToVote;
    contest.qualifiedToSubmit = balances.qualifiedToSubmit;

    if (
      contractConfig &&
      //@ts-ignore
      contractConfig.contractInterface?.filter(el => el.name === "officialRewardsModule").length > 0
    ) {
      const contestRewardModuleAddress = await readContract({
        ...contractConfig,
        functionName: "officialRewardsModule",
      }).catch(error => {
        console.error("Error reading contract:", error);
        return "0x0000000000000000000000000000000000000000";
      });

      if (contestRewardModuleAddress.toString() == "0x0000000000000000000000000000000000000000") {
        contest.rewards = null;
      } else {
        const abiRewardsModule = await getRewardsModuleContractVersion(
          contestRewardModuleAddress.toString(),
          contest.network_name,
        ).catch(error => {
          console.error("Error getting rewards module contract version:", error);
          return null;
        });

        if (abiRewardsModule === null) {
          contest.rewards = null;
        } else {
          const [winners, tokenBalances] = await Promise.all([
            readContract({
              addressOrName: contestRewardModuleAddress.toString(),
              contractInterface: abiRewardsModule,
              chainId: chain?.id,
              functionName: "getPayees",
            }).catch(error => {
              console.error("Error reading contract for winners:", error);
              return [];
            }),
            fetchTokenBalances(contest, contestRewardModuleAddress.toString()).catch(error => {
              console.error("Error fetching token balances:", error);
              return [];
            }),
          ]);

          if (tokenBalances && tokenBalances.length > 0) {
            const firstToken = await fetchFirstToken(
              contestRewardModuleAddress.toString(),
              chain?.id ?? 0,
              tokenBalances[0].contractAddress,
            ).catch(error => {
              console.error("Error fetching first token balance:", error);
              return null;
            });

            if (firstToken) {
              contest.rewards = {
                token: {
                  symbol: firstToken?.symbol,
                  value: firstToken?.formatted,
                },
                winners: winners.length,
                numberOfTokens: tokenBalances.length,
              };
            } else {
              contest.rewards = null;
            }
          } else {
            contest.rewards = null;
          }
        }
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
