import { supabase } from "@config/supabase";
import getPagination from "@helpers/getPagination";
import { Comment, CommentsResult, Contest, Submission, SubmissionCriteria, SubmissionsResult } from "./types";

function mergeSubmissionsWithContests(submissions: Submission[], contests: Contest[]): SubmissionsResult["data"] {
  const validsubmissions = submissions.filter(submission =>
    contests.some(contest => contest.address === submission.contest_address),
  );

  const results = validsubmissions.map(submission => {
    const matchedContest = contests.find(contest => contest.address === submission.contest_address)!;
    return {
      ...submission,
      contest: matchedContest,
    };
  });

  return results;
}

function mergeCommentsWithContests(comments: Comment[], contests: Contest[]): CommentsResult["data"] {
  const validComments = comments.filter(comment =>
    contests.some(contest => contest.address === comment.contest_address),
  );

  const results = validComments.map(comment => {
    const matchedContest = contests.find(contest => contest.address === comment.contest_address)!;
    return {
      ...comment,
      contest: matchedContest,
    };
  });

  return results;
}

async function fetchSubmissions(
  criteria: SubmissionCriteria,
  range: { from: number; to: number },
): Promise<{ data: any[]; count: number }> {
  try {
    let result;

    if (criteria.vote_amount === null) {
      result = await supabase
        .from("analytics_contest_participants_v3")
        .select("network_name, contest_address, proposal_id, created_at", { count: "exact" })
        .eq("user_address", criteria.user_address)
        .is("vote_amount", criteria.vote_amount)
        .is("comment_id", null)
        .order("created_at", { ascending: false })
        .range(range.from, range.to);
    } else {
      result = await supabase
        .from("analytics_contest_participants_v3")
        .select("network_name, contest_address, proposal_id, created_at, vote_amount")
        .eq("user_address", criteria.user_address)
        .not("vote_amount", "is", null)
        .order("created_at", { ascending: false })
        .range(range.from, range.to);
    }

    const { data, count, error } = result;

    if (error) {
      throw error;
    }

    return { data, count: count ?? data.length };
  } catch (error) {
    throw error;
  }
}

async function fetchComments(userAddress: string, range: { from: number; to: number }) {
  try {
    let result;

    result = await supabase
      .from("analytics_contest_participants_v3")
      .select("network_name, contest_address, proposal_id, created_at, comment_id", { count: "exact" })
      .order("created_at", { ascending: false })
      .eq("user_address", userAddress)
      .not("comment_id", "is", null)
      .not("deleted", "is", true)
      .range(range.from, range.to);

    const { data, count, error } = result;

    if (error) {
      throw error;
    }

    return { data, count: count ?? data.length };
  } catch (error) {
    throw error;
  }
}

async function getContestDetailsByAddresses(contestAddresses: string[]) {
  try {
    const result = await supabase.from("contests_v3").select("title, address").in("address", contestAddresses);

    const { data, error } = result;
    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserSubmissions(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<SubmissionsResult> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: SubmissionCriteria = { user_address: userAddress, vote_amount: null };

  const { data: submissions, count } = await fetchSubmissions(criteria, range);

  const contestAddresses = submissions.map(p => p.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  const mergedSubmissions = mergeSubmissionsWithContests(submissions, contests);

  return { data: mergedSubmissions, count };
}

export async function getUserVotes(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<SubmissionsResult> {
  const range = getPagination(currentPage, itemsPerPage);
  const criteria: SubmissionCriteria = { user_address: userAddress };
  criteria["vote_amount"] = { neq: null };

  const { data: submissions, count } = await fetchSubmissions(criteria, range);
  const contestAddresses = submissions.map(s => s.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  const mergedSubmissions = mergeSubmissionsWithContests(submissions, contests);

  return { data: mergedSubmissions, count };
}

export async function getUserComments(
  userAddress: string,
  currentPage: number,
  itemsPerPage: number,
): Promise<CommentsResult> {
  const range = getPagination(currentPage, itemsPerPage);

  const { data: comments, count } = await fetchComments(userAddress, range);
  const contestAddresses = comments.map(c => c.contest_address);
  const contests = await getContestDetailsByAddresses(contestAddresses);

  const mergedComments = mergeCommentsWithContests(comments, contests);

  return { data: mergedComments, count };
}
