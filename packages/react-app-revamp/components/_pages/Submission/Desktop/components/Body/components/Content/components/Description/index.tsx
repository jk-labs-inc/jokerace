import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, ReactNode } from "react";
import ProgressiveImg from "./components/ProgressiveImg";
import ScrollShadow from "./components/ScrollShadow";
import { useScrollShadow } from "./hooks/useScrollShadow";
import { useSanitizedContent } from "./hooks/useSanitizedContent";
import { twitterRegex } from "@helpers/regex";
import { Tweet } from "@components/_pages/ProposalContent/components/ProposalLayout/Tweet/components/CustomTweet";

interface SubmissionPageDesktopBodyContentDescriptionProps {
  description: string;
}

const transform = (node: HTMLElement): ReactNode => {
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
};

const SubmissionPageDesktopBodyContentDescription: FC<SubmissionPageDesktopBodyContentDescriptionProps> = ({
  description,
}) => {
  const sanitizedContent = useSanitizedContent(description);
  const { scrollRef, showTopShadow, showBottomShadow, hasScrollableContent } = useScrollShadow([sanitizedContent]);

  return (
    <div className="relative">
      <ScrollShadow showTopShadow={showTopShadow} showBottomShadow={showBottomShadow} />

      <div
        ref={scrollRef}
        className={`pl-8 py-4 pr-4 flex-1 min-h-[450px] max-h-[450px] ${
          hasScrollableContent ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
      >
        <Interweave
          className={`prose prose-invert overflow-hidden`}
          content={sanitizedContent}
          matchers={[new UrlMatcher("url")]}
          transform={transform}
        />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBodyContentDescription;
