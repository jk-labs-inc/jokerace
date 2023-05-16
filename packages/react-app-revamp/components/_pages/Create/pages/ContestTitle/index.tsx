import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import ErrorMessage from "../../components/Error";
import CreateTextInput from "../../components/TextInput";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";

const CreateContestTitle = () => {
  const { title, setTitle, step, errors } = useDeployContestStore(state => state);
  const titleValidation = () => {
    if (!title || title.length < CONTEST_TITLE_MIN_LENGTH || title.length >= CONTEST_TITLE_MAX_LENGTH) {
      return "Contest title should be 10-30 characters";
    }
    return "";
  };
  const currentStepError = errors.find(error => error.step === step);

  const onNextStep = useNextStep(titleValidation);

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  return (
    <>
      <Description step={step + 1} title="what should we call your contest?" />
      <div className="mt-7 ml-[70px]">
        <CreateTextInput
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
        <div className="mt-12">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </>
  );
};

export default CreateContestTitle;
