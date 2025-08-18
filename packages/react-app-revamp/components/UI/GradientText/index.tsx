import React, { FC, PropsWithChildren, ReactNode } from "react";

interface GradientTextProps {
  isStrikethrough?: boolean;
  gradientClassName?: string;
  textSizeClassName?: string;
  isFontSabo?: boolean;
}

const emojiRegex =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

const GradientText: FC<PropsWithChildren<GradientTextProps>> = ({
  children,
  isStrikethrough,
  gradientClassName = "bg-gradient-purple",
  textSizeClassName = "text-[16px] md:text-[31px]",
  isFontSabo = true,
}) => {
  const splitTextWithEmojis = (text: string): ReactNode[] => {
    const segments: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    emojiRegex.lastIndex = 0;

    while ((match = emojiRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = text.slice(lastIndex, match.index);
        segments.push(textSegment);
      }

      segments.push(
        <span
          key={`emoji-${match.index}`}
          style={{ color: "initial", backgroundClip: "initial", WebkitBackgroundClip: "initial" }}
          className="inline-block"
        >
          {match[0]}
        </span>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      segments.push(remainingText);
    }

    return segments.length > 0 ? segments : [text];
  };

  const processedChildren = (() => {
    if (typeof children === "string") {
      return splitTextWithEmojis(children);
    }
    return children;
  })();

  return (
    <div className="relative inline-block">
      <span className={`${textSizeClassName} ${isFontSabo ? "font-sabo" : ""} inline-block`}>
        {isStrikethrough && (
          <span className="absolute inset-0 flex items-center overflow-hidden">
            <span className="w-full h-0.5 bg-gradient-purple"></span>
          </span>
        )}
        <span className={`relative z-10 ${gradientClassName} text-transparent bg-clip-text inline-block`}>
          {processedChildren}
        </span>
      </span>
    </div>
  );
};

export default GradientText;
