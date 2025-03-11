import { twitterRegex } from "@helpers/regex";
import { ReactNode } from "react";
import { Tweet } from "react-tweet";

export const transform = (node: HTMLElement): ReactNode => {
  const element = node.tagName.toLowerCase();

  switch (element) {
    case "img":
      return transformImage(node);
    case "a":
      return transformLink(node);
    default:
      return undefined;
  }
};

const transformImage = (node: HTMLElement): ReactNode => {
  const src = node.getAttribute("src") ?? "";
  return <img src={src} alt="proposal" className="rounded-[16px] max-w-full" />;
};

const transformLink = (node: HTMLElement): ReactNode => {
  const href = node.getAttribute("href");
  const tweetUrlMatch = href && href.match(twitterRegex);

  if (!tweetUrlMatch) return undefined;

  const isInsideList = isNodeInsideList(node);
  const hasTextContent = node.childNodes[0]?.textContent && node.childNodes[0]?.textContent !== href;

  if (isInsideList || hasTextContent) {
    return createExternalLink(href, node.childNodes[0]?.textContent || "");
  } else {
    const tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];
    return createTweetEmbed(tweetId);
  }
};

const isNodeInsideList = (node: HTMLElement): boolean => {
  const parentNodeName = node.parentNode?.parentNode?.nodeName;
  return ["li", "ul", "ol"].includes(parentNodeName?.toLowerCase() || "");
};

const createExternalLink = (href: string, text: string): ReactNode => (
  <a href={href} target="_blank" rel="noopener noreferrer nofollow">
    {text}
  </a>
);

const createTweetEmbed = (tweetId: string): ReactNode => (
  <div className="not-prose">
    <Tweet apiUrl={`/api/tweet/${tweetId}`} id={tweetId} />
  </div>
);
