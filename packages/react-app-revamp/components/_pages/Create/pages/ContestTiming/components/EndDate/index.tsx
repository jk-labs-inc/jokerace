import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateEndContestDate = () => {
  const { votingClose, setVotingClose, errors, step, votingOpen } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting ends") ? currentStepError.message : "";

  const onEndContesDateChange = (value: Date) => {
    setVotingClose(value);
  };

  return (
    <CreateDatePicker
      title="what time should voting close?"
      error={currentVotesOpenError}
      tip="yup: one week builds momentum, but 10-30 minutes lets everyone compete live, so design as you like"
      onChange={onEndContesDateChange}
      defaultDate={votingClose}
      minDate={votingOpen}
    />
  );
};

export default CreateEndContestDate;
