import React, { FC } from "react";

interface GradientTextProps {
  text: string;
  isStrikethrough: boolean;
  textSizeClassName?: string;
  isFontSabo?: boolean;
}

const GradientText: FC<GradientTextProps> = ({
  text,
  isStrikethrough,
  textSizeClassName = "text-[16px] md:text-[31px]",
  isFontSabo = true,
}) => {
  return (
    <div className="relative inline-block">
      <span className={`${textSizeClassName} ${isFontSabo ? "font-sabo" : ""} inline-block`}>
        {isStrikethrough && (
          <span className="absolute inset-0 flex items-center overflow-hidden">
            <span className="w-full h-0.5 bg-gradient-purple"></span>
          </span>
        )}
        <span className="relative z-10 bg-gradient-purple text-transparent bg-clip-text inline-block">{text}</span>
      </span>
    </div>
  );
};

export default GradientText;
