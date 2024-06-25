import { FC } from "react";

interface MobileStepperProps {
  totalSteps: number;
  currentStep: number;
}

const MobileStepper: FC<MobileStepperProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${currentStep === index ? "bg-neutral-14" : "bg-primary-5"}`}
        />
      ))}
    </div>
  );
};

export default MobileStepper;
