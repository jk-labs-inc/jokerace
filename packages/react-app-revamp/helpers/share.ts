import { copyToClipboard } from "./copyToClipboard";

interface UrlParams {
  [key: string]: string;
}

const BASE_LENSTER_URL = "https://hey.xyz/?";
const BASE_JOKERACE_URL = "https://jokerace.io/contest/";
const BASE_TWITTER_URL = "https://twitter.com/intent/tweet?";
const BASE_LINKEDIN_URL = "https://www.linkedin.com/sharing/share-offsite/?";
const BASE_FACEBOOK_URL = "https://www.facebook.com/sharer/sharer.php?";

const buildUrl = (baseUrl: string, params: UrlParams): string => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${baseUrl}${query}`;
};

const contestShareText = (contestName: string) => {
  return `Come play ${contestName} on @jokerace_io with me!\n`;
};

export const generateLensShareUrlForContest = (contestName: string, contestAddress: string, chain: string) => {
  const params = {
    text: contestShareText(contestName),
    url: `${BASE_JOKERACE_URL}${chain}/${contestAddress}`,
  };
  return buildUrl(BASE_LENSTER_URL, params);
};

export const generateTwitterShareUrlForContest = (contestName: string, contestAddress: string, chain: string) => {
  const params = {
    text: contestShareText(contestName),
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
    via: "jokerace_io",
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
