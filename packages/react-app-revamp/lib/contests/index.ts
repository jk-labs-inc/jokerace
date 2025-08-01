import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import { SearchOptions } from "types/search";
import { FEATURED_CONTEST_COLUMNS } from "./constants";
import { EMPTY_HASH, getContestTitleAndState } from "./contracts";
import { Contest } from "./types";
import { sortContests } from "./utils/sortContests";
import { streamProcessItems } from "./utils/streamItems";

export const ITEMS_PER_PAGE = 7;

async function fetchParticipantData(contestAddress: string, userAddress: string, networkName: string) {
  const config = await import("@config/supabase");
  const supabase = config.supabase;

  const { data } = await supabase
    .from("contest_participants_v3")
    .select("can_submit, num_votes")
    .eq("user_address", userAddress)
    .eq("contest_address", contestAddress)
    .eq("network_name", networkName);

  return data && data.length > 0 ? data[0] : null;
}

async function updateContestWithUserQualifications(contest: any, userAddress: string) {
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
}

async function processContestQualifications(contest: any, userAddress: string) {
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
}

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
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, type, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
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
          const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
          const processedContest = await processContestQualifications({ ...contest, title }, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled,
          };
        }),
      );

      return { data: processedData, count };
    } catch (e) {
      console.error(e);
    }
  }
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
            "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, type, submissionMerkleRoot, hidden, votingMerkleRoot, voting_requirements, submission_requirements",
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
          const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
          const processedContest = await processContestQualifications({ ...contest, title }, currentUserAddress);
          return {
            ...processedContest,
            isCanceled,
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

export async function* streamFeaturedContests(
  currentPage: number,
  itemsPerPage: number,
  userAddress?: string,
): AsyncGenerator<Contest, void, unknown> {
  const contestStream = streamProcessItems<any, Contest>(
    "contests_v3",
    query => query.is("featured", true),
    async contest => {
      try {
        const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
        const processedContest = await processContestQualifications({ ...contest, title }, userAddress ?? "");

        return {
          ...processedContest,
          isCanceled,
        };
      } catch (err) {
        console.error(`Error processing contest ${contest.address}:`, err);
        return null;
      }
    },
    { currentPage, itemsPerPage },
    FEATURED_CONTEST_COLUMNS,
  );

  for await (const contest of contestStream) {
    yield contest;
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
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, type, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
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
          const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
          const processedContest = await processContestQualifications({ ...contest, title }, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled,
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
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, type, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
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
          const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
          const processedContest = await processContestQualifications({ ...contest, title }, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled,
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
          "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, type, submissionMerkleRoot, votingMerkleRoot, voting_requirements, submission_requirements",
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
          const { title, isCanceled } = await getContestTitleAndState(contest.address, contest.network_name);
          const processedContest = await processContestQualifications({ ...contest, title }, userAddress ?? "");
          return {
            ...processedContest,
            isCanceled,
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
