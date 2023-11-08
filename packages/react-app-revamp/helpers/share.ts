import { Reward } from "@hooks/useContest/store";
import { copyToClipboard } from "./copyToClipboard";

interface UrlParams {
  [key: string]: string;
}

const BASE_LENSTER_URL = "https://hey.xyz/?";
const BASE_JOKERACE_URL = "https://jokerace.xyz/contest/";
const BASE_TWITTER_URL = "https://twitter.com/intent/tweet?";
const BASE_LINKEDIN_URL = "https://www.linkedin.com/sharing/share-offsite/?";
const BASE_FACEBOOK_URL = "https://www.facebook.com/sharer/sharer.php?";

const buildUrl = (baseUrl: string, params: UrlParams): string => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${baseUrl}${query}`;
};

const contestShareText = (contestName: string, contestSummary?: string, rewards?: Reward | null) => {
  let rewardsText = "";
  if (rewards && rewards.token && rewards.token.value && rewards.token.symbol) {
    rewardsText = `to win ${rewards.token.value}$ ${rewards.token.symbol}`;
  }

  const summaryText = contestSummary ? ` lets players compete to ${contestSummary}` : "";
  const playText = contestSummary ? `\n\n come play it with me ${rewardsText}` : `\n\n come play it with me`;

  return `${contestName} on @jokerace_xyz${summaryText}${playText}`;
};

export const generateLensShareUrlForContest = (
  contestName: string,
  contestSummary: string,
  contestAddress: string,
  chain: string,
  rewards?: Reward | null,
) => {
  const params = {
    text: contestShareText(contestName, contestSummary, rewards),
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}`,
  };
  return buildUrl(BASE_LENSTER_URL, params);
};

export const generateTwitterShareUrlForContest = (
  contestName: string,
  contestSummary: string,
  contestAddress: string,
  chain: string,
  rewards?: Reward | null,
) => {
  const params = {
    text: contestShareText(contestName, contestSummary, rewards),
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}`,
  };
  return buildUrl(BASE_TWITTER_URL, params);
};

export const generateLensShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
  };
  return buildUrl(BASE_LENSTER_URL, params);
};

export const generateTwitterShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
    via: "jokerace_xyz",
  };
  return buildUrl(BASE_TWITTER_URL, params);
};

export const generateLinkedInShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
  };
  return buildUrl(BASE_LINKEDIN_URL, params);
};

export const generateFacebookShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    u: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
  };
  return buildUrl(BASE_FACEBOOK_URL, params);
};

export const generateUrlToCopy = (contestAddress: string, chain: string) => {
  const url = `${BASE_JOKERACE_URL}${chain}/${contestAddress}`;
  copyToClipboard(url, "Contest url copied to clipboard!");
};

export const generateUrlSubmissions = (contestAddress: string, chain: string, proposalId: string) => {
  const url = `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${proposalId}`;
  return url;
};
export const generateUrlContest = (contestAddress: string, chain: string) => {
  const url = `${BASE_JOKERACE_URL}${chain}/${contestAddress}`;
  return url;
};
