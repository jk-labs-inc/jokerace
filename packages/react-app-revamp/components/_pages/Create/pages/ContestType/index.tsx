import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import CreateDropdown from "../../components/Dropdown";
import { CONTEST_TYPE_MAX_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

const CreateContestType = () => {
  const { type, setType, errors, setStep, step } = useDeployContestStore(state => state);
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

  const onNextStep = () => {
    const currentStepError = errors.find(error => error.step === step);
    if (currentStepError) return;

    setStep(step + 1);
  };

  return (
    <>
      <Description
        step={step + 1}
        title="how would you like your contest to be listed for users to find?"
        additionalContent={additionalContent}
      />
      <div className="mt-7 ml-[70px]">
        <CreateDropdown
          step={step}
          option={type}
          onOptionChange={onOptionChangeHandler}
          maxLength={CONTEST_TYPE_MAX_LENGTH}
          errorMessage="tag should be no more than 20 characters"
        />
        <div className="mt-12">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </>
  );
};

export default CreateContestType;
