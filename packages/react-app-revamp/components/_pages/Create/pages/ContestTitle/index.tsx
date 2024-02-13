import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
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
    <div className="mt-12 lg:mt-[78px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-[24px] text-primary-10 font-bold">what’s the title?</p>
            <p className="text-[20px] text-neutral-11">
              a good contest title is usually 2-4 words long and includes the name of your <br /> community for higher
              engagement.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <CreateTextInput
                className="w-full md:w-[600px]"
                value={title}
                placeholder="eg. gitcoin bounty for devs"
                minLength={CONTEST_TITLE_MIN_LENGTH}
                maxLength={CONTEST_TITLE_MAX_LENGTH}
                onChange={value => handleTitleChange(value)}
              />
              {/* TODO: display error message as you type */}
              {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
            </div>

            <CreateNextButton step={step + 1} onClick={onNextStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTitle;
