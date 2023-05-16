import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";

const CreateEndContestDate = () => {
  const { votingClose, setVotingClose, submissionOpen, votingOpen, setError } = useDeployContestStore(state => state);
  const localISOTime = moment(votingClose).format("YYYY-MM-DDTHH:mm");

  const onEndContesDateChange = (value: string) => {
    setVotingClose(moment(value).toDate());
  };

  const invalidDates = (dates: Date[], votingClose: Date) => {
    return dates.some(date => moment(date).isAfter(moment(votingClose)));
  };

  return (
    <CreateDatePicker
      title="what time should voting close?"
      tip="yup: one week builds momentum, but 10-30 minutes lets everyone compete live, so design as you like"
      onChange={onEndContesDateChange}
      defaultTime={localISOTime}
      invalidDate={invalidDates([submissionOpen, votingOpen], votingClose)}
    />
  );
};

export default CreateEndContestDate;
