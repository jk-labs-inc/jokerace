import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, ReactElement } from "react";

interface Step {
  title: string;
  content: ReactElement;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: FC<StepperProps> = ({ steps }) => {
  const { step: currentStep, setStep: setCurrentStep, furthestStep, errors } = useDeployContestStore(state => state);

  const handleStepClick = (index: number) => {
    // Find the error for the current step
    const currentStepError = errors.find(error => error.step === currentStep);

    // Prevent navigation if there's an error for the current step and the user is trying to go forward
    if (currentStepError && index > currentStep) return;

    // Allow navigation if the user is trying to go to a step they have already reached
    if (index <= furthestStep) {
      setCurrentStep(index);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mt-12">
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => handleStepClick(index)}
            className="flex flex-col items-center text-[24px] font-bold cursor-pointer relative"
          >
            <hr
              className={`w-32 3xl:w-36 border-2 transition-colors duration-500 ease-in-out ${
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
      <div className="pl-[100px]">{steps[currentStep].content}</div>
    </div>
  );
};

export default Stepper;
