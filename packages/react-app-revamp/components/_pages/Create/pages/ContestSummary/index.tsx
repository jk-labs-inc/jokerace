import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMedia } from "react-use";
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
  const { summary, setSummary, step, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const summaryValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => summaryValidation?.[0].validation(summary)]);
  const isMobile = useMedia("(max-width: 768px)");

  const placeholderText = isMobile ? MOBILE_PLACEHOLDER : DESKTOP_PLACEHOLDER;

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  return (
    <div className="mt-12 lg:mt-[78px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start  gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-[24px] text-primary-10 font-bold">what’s the summary?</p>
            <p className="text-[20px] text-neutral-11">
              we’ll use the summary as a teaser text to draw players to your contest. a <br />
              good summary is usually 3-5 words long and tells players what to do.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <CreateTextInput
                className="w-full md:w-[740px]"
                value={summary}
                placeholder={placeholderText}
                minLength={CONTEST_TITLE_MIN_LENGTH}
                maxLength={CONTEST_TITLE_MAX_LENGTH}
                onChange={value => handleSummaryChange(value)}
                onNextStep={onNextStep}
              />
              {currentStepError ? <ErrorMessage error={(currentStepError || { message: "" }).message} /> : null}
            </div>

            <CreateNextButton step={step + 1} onClick={onNextStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestSummary;
