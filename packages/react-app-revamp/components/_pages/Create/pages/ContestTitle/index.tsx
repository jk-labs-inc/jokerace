import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

const CreateContestTitle = () => {
  const { title, setTitle, step, errors } = useDeployContestStore(state => state);

  const currentStepError = errors.find(error => error.step === step);
  const titleValidation = validationFunctions.get(step);

  const onNextStep = useNextStep([() => titleValidation?.[0].validation(title)]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  return (
    <div className="mt-12 lg:mt-[100px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <p className="text-primary-10 font-bold">what should we call your contest?</p>
      </div>
      <div className="mt-7 lg:ml-[70px]">
        <CreateTextInput
          className="w-full md:w-[600px]"
          value={title}
          placeholder="eg. bundlr bounty contest for devs"
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={value => handleTitleChange(value)}
          onNextStep={onNextStep}
        />
        {currentStepError ? (
          <ErrorMessage error={(currentStepError || { message: "" }).message} />
        ) : (
          <TipMessage tip="tip: include your community’s name for higher engagement" error={""} />
        )}
        <div className="mt-20 md:mt-12">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestTitle;
