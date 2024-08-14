import React, { FC } from "react";

interface GradientTextProps {
  text: string;
  isStrikethrough: boolean;
}

const GradientText: FC<GradientTextProps> = ({ text, isStrikethrough }) => {
  return (
    <div className="relative inline-block">
      <span className="text-[24px] md:text-[31px] font-sabo inline-block">
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
