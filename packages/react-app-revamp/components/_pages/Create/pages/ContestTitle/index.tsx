import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
import CreateUploadImage from "../../components/UploadImage";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

const CreateContestTitle = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { title, setTitle, step, errors, prompt } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const onNextStep = useNextStep();

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">let's title it</p>
        </div>

        <div className="grid gap-12 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          <CreateUploadImage />

          <div className="flex flex-col gap-2">
            <p className="text-[20px] font-bold text-neutral-11">
              contest title <span className="font-normal">(required)</span>
            </p>
            <CreateTextInput
              className="w-full md:w-[600px] text-[20px]"
              value={title}
              placeholder="eg. gitcoin bounty for devs"
              minLength={CONTEST_TITLE_MIN_LENGTH}
              maxLength={CONTEST_TITLE_MAX_LENGTH}
              onChange={value => handleTitleChange(value)}
            />
            <span
              className={`text-[16px] text-neutral-11 ${title.length === CONTEST_TITLE_MAX_LENGTH ? "text-negative-11" : "text-neutral-11"}`}
            >
              {title.length}/{CONTEST_TITLE_MAX_LENGTH} characters
            </span>
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

export default CreateContestTitle;
