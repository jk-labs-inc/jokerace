import { copyToClipboard } from "./copyToClipboard";

interface UrlParams {
  [key: string]: string;
}

const BASE_LENSTER_URL = "https://lenster.xyz/?";
const BASE_JOKERACE_URL = "https://jokerace.xyz/contest/";
const BASE_TWITTER_URL = "https://twitter.com/intent/tweet?";

const buildUrl = (baseUrl: string, params: UrlParams): string => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${baseUrl}${query}`;
};

export const generateLensShareUrlForContest = (contestName: string, contestAddress: string, chain: string) => {
  const params = {
    text: `just launched a contest on jokerace, ${contestName} — come play to win`,
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}`,
  };
  return buildUrl(BASE_LENSTER_URL, params);
};

export const generateLensShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
  };
  return buildUrl(BASE_LENSTER_URL, params);
};

export const generateTwitterShareUrlForContest = (contestName: string, contestAddress: string, chain: string) => {
  const params = {
    text: `just launched a contest on jokerace, ${contestName} — come play to win`,
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}`,
    via: "jokerace_xyz",
  };
  return buildUrl(BASE_TWITTER_URL, params);
};

export const generateTwitterShareUrlForSubmission = (contestAddress: string, chain: string, submissionId: string) => {
  const params = {
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}/submission/${submissionId}`,
    via: "jokerace_xyz",
  };
  return buildUrl(BASE_TWITTER_URL, params);
};

export const generateUrlToCopy = (contestAddress: string, chain: string) => {
  const url = `${BASE_JOKERACE_URL}${chain}/${contestAddress}`;
  copyToClipboard(url, "Contest url copied to clipboard!");
};
