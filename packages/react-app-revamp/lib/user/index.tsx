import { supabase } from "@config/supabase";
import { isSupabaseConfigured } from "@helpers/database";

const getPagination = (currentPage: number, itemsPerPage: number) => {
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  return { from, to };
};

export async function getUserSubmittedProposals(userAddress: string, currentPage: number, itemsPerPage: number) {
  if (isSupabaseConfigured) {
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("analytics_contest_participants_v3")
        .select("network_name, contest_address, proposal_id, created_at", { count: "exact" })
        .eq("user_address", userAddress)
        .is("vote_amount", null)
        .range(from, to);

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
  return { data: [], count: 0 };
}

export async function getUserVotedProposals(userAddress: string, currentPage: number, itemsPerPage: number) {
  if (isSupabaseConfigured) {
    const { from, to } = getPagination(currentPage, itemsPerPage);
    try {
      const result = await supabase
        .from("analytics_contest_participants_v3")
        .select("network_name, contest_address, proposal_id, created_at", { count: "exact" })
        .eq("user_address", userAddress)
        .not("vote_amount", "eq", null)
        .order("proposal_id", { ascending: true })
        .order("contest_address", { ascending: true })
        .order("network_name", { ascending: true })
        .order("created_at", { ascending: true })
        .range(from, to);

      const { data, count, error } = result;
      if (error) {
        throw new Error(error.message);
      }

      return { data, count };
    } catch (e) {
      console.error(e);
    }
  }
  return { data: [], count: 0 };
}
