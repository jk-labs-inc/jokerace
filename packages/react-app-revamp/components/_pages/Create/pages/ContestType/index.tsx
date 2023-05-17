import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import CreateDropdown from "../../components/Dropdown";
import ErrorMessage from "../../components/Error";
import { CONTEST_TYPE_MAX_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

const options = [
  "hackathon",
  "grants round",
  "bounty",
  "pulse check",
  "amend a proposal",
  "contest competition",
  "giveaway",
  "feature request",
  "curation",
  "game",
  "election",
];

const CreateContestType = () => {
  const { type, setType, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);

  const [fadeBg, setFadeBg] = useState(false);
  const typeValidation = () => {
    if (!type || type.length >= CONTEST_TYPE_MAX_LENGTH) {
      return "tag should be no more than 20 characters";
    }
    return "";
  };
  const onNextStep = useNextStep(typeValidation);

  const additionalContent = (
    <p>
      contests let people submit responses to a prompt and vote on favorites.
      <br />
      you decide who submits, who votes, and how many votes they have.
    </p>
  );

  const onOptionChangeHandler = (option: string) => {
    setType(option);
  };

  return (
    <>
      <Description
        step={step + 1}
        title="how would you like your contest to be listed for users to find?"
        additionalContent={additionalContent}
      />
      <div className="mt-7 ml-[70px]">
        <CreateDropdown value={type} onChange={onOptionChangeHandler} onMenuStateChange={setFadeBg} options={options} />
        {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
        <div className={`mt-12 ${fadeBg ? "opacity-50" : "opacity-100"}  transition-opacity duration-300 ease-in-out `}>
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </>
  );
};

export default CreateContestType;
