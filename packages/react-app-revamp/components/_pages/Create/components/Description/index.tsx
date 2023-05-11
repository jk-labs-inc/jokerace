import React, { FC, ReactNode } from "react";

interface DescriptionProps {
  step: number;
  title: string;
  additionalContent?: ReactNode;
}

const Description: FC<DescriptionProps> = ({ step, title, additionalContent }) => {
  return (
    <div className={`flex ${additionalContent ? "items-start" : "items-center"}  gap-5 text-[24px]`}>
      <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold">
        {step}
      </div>
      <div className="flex flex-col gap-5">
        {additionalContent && <div className="text-neutral-11 font-normal">{additionalContent}</div>}
        <div className="text-primary-10 font-bold">{title}</div>
      </div>
    </div>
  );
};

export default Description;
