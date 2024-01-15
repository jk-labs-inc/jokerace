/* eslint-disable react/no-unescaped-entities */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect, useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import CreateDropdown, { Option } from "../../components/Dropdown";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

const options: Option[] = [
  { value: "hackathon", label: "hackathon" },
  { value: "grants round", label: "grants round" },
  { value: "bounty", label: "bounty" },
  { value: "pulse check", label: "pulse check" },
  { value: "amend a proposal", label: "amend a proposal" },
  { value: "contest competition", label: "contest competition" },
  { value: "giveaway", label: "giveaway" },
  { value: "feature request", label: "feature request" },
  { value: "curation", label: "curation" },
  { value: "game", label: "game" },
  { value: "election", label: "election" },
];

const CreateContestType = () => {
  const { type, setType, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const [fadeBg, setFadeBg] = useState(false);
  const typeValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => typeValidation?.[0].validation(type)]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const onOptionChangeHandler = (option: string) => {
    setType(option);
  };

  return (
    <div className="mt-12 lg:mt-[100px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-5 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-5">
          <p className="text-neutral-11 font-normal">
            contests let people submit responses to a prompt and vote on favorites.
            <br />
            you decide who submits, who votes, and how many votes they have.
          </p>
          <p className="text-primary-10 font-bold">
            what kind of contest are you creating? (we'll use this as a tag to help users find it)
          </p>
        </div>
      </div>
      <div className="mt-7 lg:ml-[70px]">
        <CreateDropdown
          value={type}
          onChange={onOptionChangeHandler}
          onMenuStateChange={setFadeBg}
          options={options}
          className="w-full md:w-[600px]"
        />
        {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
        <div className={`mt-12 ${fadeBg ? "opacity-50" : "opacity-100"}  transition-opacity duration-300 ease-in-out `}>
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestType;
