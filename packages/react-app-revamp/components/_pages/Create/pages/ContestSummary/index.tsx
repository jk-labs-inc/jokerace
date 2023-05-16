import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import ErrorMessage from "../../components/Error";
import CreateTextInput from "../../components/TextInput";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

const CreateContestSummary = () => {
  const { summary, setSummary, step, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);

  const onNextStep = useNextStep(() => {
    if (!summary || summary.length < CONTEST_TITLE_MIN_LENGTH || summary.length >= CONTEST_TITLE_MAX_LENGTH) {
      return "Contest summary should be 10-30 characters";
    }
    return "";
  });

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  return (
    <>
      <Description step={step + 1} title="what’s a 2-3 word summary of how to participate in your contest?" />
      <div className="mt-7 ml-[70px]">
        <CreateTextInput
          value={summary}
          placeholder="eg. “submit a project” “propose a delegate” “predict the market”"
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={value => handleSummaryChange(value)}
          onNextStep={onNextStep}
        />
        {currentStepError ? (
          <ErrorMessage error={(currentStepError || { message: "" }).message} />
        ) : (
          <TipMessage tip="we’ll use this to summarize and promote your contest on our site" error={""} />
        )}
        <div className="mt-12">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </>
  );
};

export default CreateContestSummary;
