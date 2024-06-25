import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTagDropdown, { Option } from "../../components/TagDropdown";
import { useNextStep } from "../../hooks/useNextStep";

const options: Option[] = [
  { value: "amend a proposal", label: "amend a proposal" },
  { value: "apply for role", label: "apply for role" },
  { value: "awards ceremony", label: "awards ceremony" },
  { value: "bounty", label: "bounty" },
  { value: "curation", label: "curation" },
  { value: "election", label: "election" },
  { value: "feature request", label: "feature request" },
  { value: "game", label: "game" },
  { value: "governance", label: "governance" },
  { value: "hackathon", label: "hackathon" },
  { value: "ideathon", label: "ideathon" },
  { value: "pulse check", label: "pulse check" },
  { value: "test", label: "test" },
  { value: "other", label: "other" },
];

const CreateContestType = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { type, setType, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const [fadeBg, setFadeBg] = useState(false);
  const onNextStep = useNextStep();
  const stepTitle = isMobile ? "tag" : "let’s give it a lil’ tag";

  const onOptionChangeHandler = (option: string) => {
    setType(option);
  };

  return (
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] font-bold text-primary-10">{stepTitle}</p>
      </div>
      <div className="grid gap-12 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
        <p className="text-[20px] text-neutral-11">how should we tag your contest for players to find it?</p>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-2">
            <CreateTagDropdown
              value={type}
              onChange={onOptionChangeHandler}
              onMenuStateChange={setFadeBg}
              options={options}
              className="w-full md:w-[240px] text-[20px]"
            />
            {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
          </div>
          <div className={`${fadeBg ? "opacity-50" : "opacity-100"} mt-4 transition-opacity duration-300 ease-in-out `}>
            <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestType;
