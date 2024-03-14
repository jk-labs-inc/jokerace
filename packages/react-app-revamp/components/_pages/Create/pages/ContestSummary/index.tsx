import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback, useEffect } from "react";
import { useMedia } from "react-use";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

// Define your mobile and desktop placeholders.
const MOBILE_PLACEHOLDER = "eg. “submit a project” “propose a delegate”";
const DESKTOP_PLACEHOLDER = "eg. “submit a project” “propose a delegate” “predict the market”";

const CreateContestSummary = () => {
  const { summary, setSummary, step, errors, mobileStepTitle, resetMobileStepTitle } = useDeployContestStore(
    state => state,
  );
  const currentStepError = errors.find(error => error.step === step);
  const summaryValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => summaryValidation?.[0].validation(summary)]);
  const isMobile = useMedia("(max-width: 768px)");

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle) return;

    if (mobileStepTitle === steps[step].title) {
      onNextStep();
      resetMobileStepTitle();
    }
  }, [mobileStepTitle, onNextStep, resetMobileStepTitle, step]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

  const placeholderText = isMobile ? MOBILE_PLACEHOLDER : DESKTOP_PLACEHOLDER;

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  return (
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] text-primary-10 font-bold">what’s the summary?</p>
      </div>
      <div className="grid gap-12 col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-6">
        <p className="text-[20px] text-neutral-11">
          we’ll use the summary as a teaser text to draw players to your contest. a <br />
          good summary is usually 3-5 words long and tells players what to do.
        </p>
        <div className="flex flex-col gap-2">
          <CreateTextInput
            className="w-full md:w-[740px]"
            value={summary}
            placeholder={placeholderText}
            minLength={CONTEST_TITLE_MIN_LENGTH}
            maxLength={CONTEST_TITLE_MAX_LENGTH}
            onChange={value => handleSummaryChange(value)}
          />
          {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
        </div>

        <div className="mt-4">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestSummary;
