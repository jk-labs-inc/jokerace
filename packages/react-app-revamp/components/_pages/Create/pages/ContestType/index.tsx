import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTagDropdown, { Option } from "../../components/TagDropdown";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

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
  const { type, setType, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const [fadeBg, setFadeBg] = useState(false);
  const typeValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => typeValidation?.[0].validation(type)]);

  const onOptionChangeHandler = (option: string) => {
    setType(option);
  };

  return (
    <div className="mt-12 lg:mt-[78px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-[24px] font-bold text-primary-10">let’s give it a lil’ tag</p>
            <p className="text-[20px] text-neutral-11">how should we tag your contest for players to find it?</p>
          </div>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <CreateTagDropdown
                value={type}
                onChange={onOptionChangeHandler}
                onMenuStateChange={setFadeBg}
                options={options}
                className="w-full md:w-[240px]"
              />
              {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
            </div>
            <div className={`${fadeBg ? "opacity-50" : "opacity-100"}  transition-opacity duration-300 ease-in-out `}>
              <CreateNextButton step={step + 1} onClick={onNextStep} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestType;
