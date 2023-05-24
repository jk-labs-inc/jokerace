import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";

const CreateEndContestDate = () => {
  const { votingClose, setVotingClose, errors, step } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting ends") ? currentStepError.message : "";
  const localISOTime = moment(votingClose).format("YYYY-MM-DDTHH:mm");

  const onEndContesDateChange = (value: string) => {
    setVotingClose(moment(value).toDate());
  };

  return (
    <CreateDatePicker
      title="what time should voting close?"
      error={currentVotesOpenError}
      tip="yup: one week builds momentum, but 10-30 minutes lets everyone compete live, so design as you like"
      onChange={onEndContesDateChange}
      defaultTime={localISOTime}
    />
  );
};

export default CreateEndContestDate;
