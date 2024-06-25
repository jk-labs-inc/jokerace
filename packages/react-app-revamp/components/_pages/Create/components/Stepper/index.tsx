/* eslint-disable react/no-unescaped-entities */
import { isSupabaseConfigured } from "@helpers/database";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, ReactElement, useState } from "react";
import { useNextStep } from "../../hooks/useNextStep";
import CreateContestDeploying from "../../pages/ContestDeploying";

interface Step {
  title: string;
  content: ReactElement;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: FC<StepperProps> = ({ steps }) => {
  const { step: currentStep, isLoading, isSuccess } = useDeployContestStore(state => state);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const onNextStep = useNextStep();

  const handleStepClick = (index: number) => {
    onNextStep(index);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center mt-40">
        <p className="text-[24px] font-sabo text-primary-10">
          Oops, it seems you've forgotten to include environmental variables!
        </p>
        <p className="text-[16px]">
          for more details, visit{" "}
          <a className="text-positive-11" href="https://github.com/jk-labs-inc/jokerace#readme" target="_blank">
            <b>here!</b>
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {isLoading || isSuccess ? (
        <CreateContestDeploying />
      ) : (
        <div>
          <div className="hidden lg:flex gap-[6px] mt-12">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                className="flex flex-col items-center text-[16px] 3xl:text-[18px] 4xl:text-[20px] font-bold cursor-pointer relative"
              >
                <hr
                  className={`w-24 3xl:w-28 4xl:w-36 border-2 transition-colors duration-500 ease-in-out ${
                    currentStep === index
                      ? "border-neutral-11"
                      : currentStep > index
                        ? "border-neutral-10"
                        : "border-neutral-10"
                  }`}
                />
                {currentStep === index ? (
                  <p className="text-neutral-11">{step.title}</p>
                ) : hoveredStep === index ? (
                  <p className="text-neutral-10">{step.title}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="lg:pl-[100px]">{steps[currentStep].content}</div>
        </div>
      )}
    </div>
  );
};

export default Stepper;
