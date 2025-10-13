import { ReactNode } from "react";
import { twitterRegex } from "@helpers/regex";
import { Tweet } from "@components/_pages/ProposalContent/components/ProposalLayout/Tweet/components/CustomTweet";
import ProgressiveImg from "../components/ProgressiveImg";

export const transform = (node: HTMLElement): ReactNode => {
  const element = node.tagName.toLowerCase();

  if (element === "img") {
    const src = node.getAttribute("src");
    const alt = node.getAttribute("alt") || "";

    if (!src) return null;

    return <ProgressiveImg src={src} alt={alt} />;
  }

  if (element === "a") {
    const href = node.getAttribute("href");
    const tweetUrlMatch = href && href.match(twitterRegex);

    const isInsideList =
      node.parentNode?.parentNode?.nodeName === "li" ||
      node.parentNode?.parentNode?.nodeName === "ul" ||
      node.parentNode?.parentNode?.nodeName === "ol";

    if (tweetUrlMatch) {
      if (isInsideList) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent || ""}
          </a>
        );
      }

      const hasTextContent = node.childNodes[0]?.textContent && node.childNodes[0]?.textContent !== href;

      if (hasTextContent) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent}
          </a>
        );
      } else {
        const tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];
        return (
          <div className="min-w-[250px] max-w-[550px]">
            <Tweet apiUrl={`/api/tweet/${tweetId}`} id={tweetId} />
          </div>
        );
      }
    }
  }

  return undefined;
};
