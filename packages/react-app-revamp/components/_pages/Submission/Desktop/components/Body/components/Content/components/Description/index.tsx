import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, ReactNode } from "react";
import ProgressiveImg from "./components/ProgressiveImg";
import ScrollShadow from "./components/ScrollShadow";
import { useScrollShadow } from "./hooks/useScrollShadow";
import { useSanitizedContent } from "./hooks/useSanitizedContent";

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
};

const SubmissionPageDesktopBodyContentDescription: FC<SubmissionPageDesktopBodyContentDescriptionProps> = ({
  description,
}) => {
  const sanitizedContent = useSanitizedContent(description);
  const { scrollRef, showTopShadow, showBottomShadow, hasScrollableContent } = useScrollShadow(sanitizedContent);

  return (
    <div className="relative">
      <ScrollShadow showTopShadow={showTopShadow} showBottomShadow={showBottomShadow} />

      <div
        ref={scrollRef}
        className={`pl-8 py-4 pr-4 flex-1 max-h-[550px] ${
          hasScrollableContent ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
      >
        <Interweave content={sanitizedContent} matchers={[new UrlMatcher("url")]} transform={transform} />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBodyContentDescription;
