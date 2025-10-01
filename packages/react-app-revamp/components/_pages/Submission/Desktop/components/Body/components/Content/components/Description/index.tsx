import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC } from "react";
import ScrollShadow from "./components/ScrollShadow";
import { useScrollShadow } from "./hooks/useScrollShadow";
import { useSanitizedContent } from "./hooks/useSanitizedContent";
import { transform } from "./helpers/transform";

interface SubmissionPageDesktopBodyContentDescriptionProps {
  description: string;
}

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
