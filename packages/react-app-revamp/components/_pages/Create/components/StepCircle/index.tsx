import { FC } from "react";

interface StepCircleProps {
  step: number;
}

const StepCircle: FC<StepCircleProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-center w-[60px] h-[60px] md:w-[50px] md:h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold">
      {step}
    </div>
  );
};

export default StepCircle;
