import { copyToClipboard } from "./copyToClipboard";

export const generateLensShareUrl = (contestName: string, contestAddress: string, chain: string) => {
  const baseLensterUrl = "https://lenster.xyz/?";
  const text = encodeURIComponent(`just launched a contest on joke, ${contestName} — come play to win`);
  const shareUrl = encodeURIComponent(`https://jokedao.io/contest/${chain}/${contestAddress}`);

  const lensShareUrl = `${baseLensterUrl}text=${text}&url=${shareUrl}`;

  return lensShareUrl;
};

export const generateTwitterShareUrl = (contestName: string, contestAddress: string, chain: string) => {
  const baseTwitterUrl = "https://twitter.com/intent/tweet?";
  const text = encodeURIComponent(`just launched a contest on joke, ${contestName} — come play to win`);
  const shareUrl = encodeURIComponent(`https://jokedao.io/contest/${chain}/${contestAddress}`);
  const viaParam = encodeURIComponent("jokedao_");

  const twitterShareUrl = `${baseTwitterUrl}text=${text}&url=${shareUrl}&via=${viaParam}`;

  return twitterShareUrl;
};

export const generateUrlToCopy = (contestAddress: string, chain: string) => {
  const url = `https://jokedao.io/contest/${chain}/${contestAddress}`;
  copyToClipboard(url, "Contest url copied to clipboard!");
};
