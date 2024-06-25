import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMedia } from "react-use";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

// Define your mobile and desktop placeholders.
const MOBILE_PLACEHOLDER = "eg. “submit a project”";
const DESKTOP_PLACEHOLDER = "eg. “submit a project” “propose a delegate” “predict the market”";

const CreateContestSummary = () => {
  const { summary, setSummary, step, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const onNextStep = useNextStep();
  const isMobile = useMedia("(max-width: 768px)");
  const stepTitle = isMobile ? "summary" : "what’s the summary?";

  const placeholderText = isMobile ? MOBILE_PLACEHOLDER : DESKTOP_PLACEHOLDER;

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-primary-10 font-bold">{stepTitle}</p>
        </div>
        <div className="grid gap-12 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          {isMobile ? (
            <p className="text-[20px] text-neutral-11">
              the summary will be used as a teaser to draw players to your contest. aim for 3-5 words saying how to
              submit.
            </p>
          ) : (
            <p className="text-[20px] text-neutral-11">
              we’ll use the summary as a teaser text to draw players to your contest. a <br />
              good summary is usually 3-5 words long and tells players what to do.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <CreateTextInput
              className="w-full md:w-[740px] text-[20px]"
              value={summary}
              placeholder={placeholderText}
              minLength={CONTEST_TITLE_MIN_LENGTH}
              maxLength={CONTEST_TITLE_MAX_LENGTH}
              onChange={value => handleSummaryChange(value)}
            />
            {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
          </div>

          <div className="mt-4">
            <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestSummary;
