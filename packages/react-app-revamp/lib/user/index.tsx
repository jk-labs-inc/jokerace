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
    const params = new URLSearchParams({
      userAddress: criteria.user_address,
      from: range.from.toString(),
      to: range.to.toString(),
      voteAmount: criteria.vote_amount === null ? "null" : "notNull",
    });

    const response = await fetch(`/api/user/submissions?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch submissions");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
}

async function fetchComments(
  userAddress: string,
  range: { from: number; to: number },
): Promise<{ data: any[]; count: number }> {
  try {
    const params = new URLSearchParams({
      userAddress,
      from: range.from.toString(),
      to: range.to.toString(),
    });

    const response = await fetch(`/api/user/comments?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

async function getContestDetailsByAddresses(contestAddresses: string[]) {
  try {
    const params = new URLSearchParams({
      addresses: contestAddresses.join(","),
    });

    const response = await fetch(`/api/contest/get-details-by-address?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch contest details");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contest details:", error);
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
