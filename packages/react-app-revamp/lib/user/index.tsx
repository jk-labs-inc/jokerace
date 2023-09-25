import { supabase } from "@config/supabase";
import getPagination from "@helpers/getPagination";

interface ProposalCriteria {
  user_address: string;
  [key: string]: any;
}

async function fetchProposals(
  criteria: ProposalCriteria,
  range: { from: number; to: number },
): Promise<{ data: any[]; count: number }> {
  let result;

  if (criteria.vote_amount === null) {
    result = await supabase
      .from("analytics_contest_participants_v3")
      .select("network_name, contest_address, proposal_id, created_at", { count: "exact" })
      .eq("user_address", criteria.user_address)
      .is("vote_amount", criteria.vote_amount)
      .range(range.from, range.to);
  } else {
    result = await supabase
      .from("analytics_contest_participants_v3")
      .select("network_name, contest_address, proposal_id, created_at")
      .eq("user_address", criteria.user_address)
      .neq("vote_amount", null)
      .range(range.from, range.to);
  }

  const { data, count, error } = result;

  if (error) {
    console.error(error);
    return { data: [], count: 0 };
  }

  return { data, count: count ?? 0 };
}

async function getContestDetailsByAddresses(contestAddresses: string[]) {
  const result = await supabase.from("contests_v3").select("title").in("address", contestAddresses);

  const { data, error } = result;
  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// Merge proposals with their respective contest details
function mergeProposalsWithContests(proposals: any[], contests: any[]): any[] {
  return proposals.map(proposal => {
    const matchedContest = contests.find(contest => contest.address === proposal.contest_address);
    return {
      ...proposal,
      contestDetails: matchedContest,
    };
  });
}

export async function getUserSubmissions(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<{ data: any[]; count: number }> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: ProposalCriteria = { user_address: userAddress, vote_amount: null };

  const { data: proposals, count } = await fetchProposals(criteria, range);

  const contestAddresses = proposals.map(p => p.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  return { data: mergeProposalsWithContests(proposals, contests), count };
}

export async function getUserVotes(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<{ data: any[]; count: number }> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: ProposalCriteria = { user_address: userAddress };
  criteria["vote_amount"] = { neq: null };

  const { data: proposals, count } = await fetchProposals(criteria, range);
  const contestAddresses = proposals.map(p => p.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  return { data: mergeProposalsWithContests(proposals, contests), count };
}
