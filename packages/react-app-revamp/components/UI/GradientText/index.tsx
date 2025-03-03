import React, { FC, PropsWithChildren } from "react";

interface GradientTextProps {
  isStrikethrough?: boolean;
  gradientClassName?: string;
  textSizeClassName?: string;
  isFontSabo?: boolean;
}

const GradientText: FC<PropsWithChildren<GradientTextProps>> = ({
  children,
  isStrikethrough,
  gradientClassName = "bg-gradient-purple",
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
        <span className={`relative z-10 ${gradientClassName} text-transparent bg-clip-text inline-block`}>
          {children}
        </span>
      </span>
    </div>
  );
};

export default GradientText;
