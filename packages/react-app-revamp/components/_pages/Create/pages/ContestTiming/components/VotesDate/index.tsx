import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";

const CreateVotesOpenDate = () => {
  const { votingOpen, setVotingOpen, submissionOpen, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting open") ? currentStepError.message : "";

  const onVotesOpenChange = (value: Date) => {
    setVotingOpen(value);
  };

  return (
    <CreateDatePicker
      title="when time should submissions close— and voting open?"
      error={currentVotesOpenError}
      tip="one week lets you build momentum, but 50 minutes can be good during a live call—so design as you like!"
      onChange={onVotesOpenChange}
      defaultDate={votingOpen}
      minDate={submissionOpen}
    />
  );
};

export default CreateVotesOpenDate;
