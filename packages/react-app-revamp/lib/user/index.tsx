import { supabase } from "@config/supabase";

interface ProposalCriteria {
  user_address: string;
  [key: string]: any;
}

async function fetchProposals(criteria: ProposalCriteria, range: { from: number; to: number }) {
  const result = await supabase
    .from("analytics_contest_participants_v3")
    .select("network_name, contest_address, proposal_id, created_at")
    .match(criteria)
    .range(range.from, range.to);

  const { data, error } = result;
  if (error) {
    console.error(error);
    return [];
  }

  return data;
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

function getPagination(currentPage: number, itemsPerPage: number) {
  const from = (currentPage - 1) * itemsPerPage;
  const to = currentPage * itemsPerPage - 1;
  return { from, to };
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

export async function fetchUserSubmissions(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<any[]> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: ProposalCriteria = { user_address: userAddress, vote_amount: null };

  const proposals = await fetchProposals(criteria, range);
  const contestAddresses = proposals.map(p => p.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  return mergeProposalsWithContests(proposals, contests);
}

export async function fetchUserVotes(userAddress: string, currentPage: number, itemsPerPage: number): Promise<any[]> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: ProposalCriteria = { user_address: userAddress };
  criteria["vote_amount"] = { neq: null };

  const proposals = await fetchProposals(criteria, range);
  const contestAddresses = proposals.map(p => p.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  return mergeProposalsWithContests(proposals, contests);
}
