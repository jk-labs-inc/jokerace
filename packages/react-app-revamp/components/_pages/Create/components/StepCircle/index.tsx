import { FC } from "react";

interface StepCircleProps {
  step: number;
}

const StepCircle: FC<StepCircleProps> = ({ step }) => {
  return (
    <div className="flex items-center -mt-[5px] justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold">
      {step}
    </div>
  );
};

export default StepCircle;
