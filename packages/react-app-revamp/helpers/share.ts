import { copyToClipboard } from "./copyToClipboard";

export const generateLensShareUrl = (contestAddress: string, chain: string) => {
  const baseLensterUrl = "https://lenster.xyz/?";
  const text = encodeURIComponent("come check out this contest on jokedao!");
  const shareUrl = encodeURIComponent(`https://jokedao.io/contest/${chain}/${contestAddress}`);
  const hashtags = encodeURIComponent("jokedao,lens,web3");

  const lensShareUrl = `${baseLensterUrl}text=${text}&url=${shareUrl}&hashtags=${hashtags}`;

  return lensShareUrl;
};

export const generateTwitterShareUrl = (contestAddress: string, chain: string) => {
  const baseTwitterUrl = "https://twitter.com/intent/tweet?";
  const text = encodeURIComponent("come check out this contest on jokedao!");
  const shareUrl = encodeURIComponent(`https://jokedao.io/contest/${chain}/${contestAddress}`);
  const hashtags = encodeURIComponent("jokedao,web3");
  const viaParam = encodeURIComponent("jokedao_");

  const twitterShareUrl = `${baseTwitterUrl}text=${text}&url=${shareUrl}&hashtags=${hashtags}&via=${viaParam}`;

  return twitterShareUrl;
};

export const generateUrlToCopy = (contestAddress: string, chain: string) => {
  const url = `https://jokedao.io/contest/${chain}/${contestAddress}`;
  copyToClipboard(url, "Contest url copied to clipboard!");
};
