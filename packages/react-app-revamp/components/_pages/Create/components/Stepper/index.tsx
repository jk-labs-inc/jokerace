import React, { useState, FC, ReactElement } from "react";

interface Step {
  title: string;
  content: ReactElement;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div>
      <div className="flex gap-2 mt-12">
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => handleStepClick(index)}
            className="flex flex-col items-center text-[24px] font-bold cursor-pointer"
          >
            <hr
              className={`w-36 border-2 ${
                currentStep === index
                  ? "border-primary-10"
                  : currentStep > index
                  ? "border-primary-7"
                  : "border-neutral-9"
              }`}
            />
            {currentStep === index && <p className="text-primary-10">{step.title}</p>}
          </div>
        ))}
      </div>
      <div className="pl-[185px] mt-[100px]">{steps[currentStep].content}</div>
    </div>
  );
};

export default Stepper;
