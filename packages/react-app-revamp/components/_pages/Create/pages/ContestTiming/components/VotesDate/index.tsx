import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";
import { useMemo } from "react";

const CreateVotesOpenDate = () => {
  const { votingOpen, setVotingOpen, submissionOpen, setError } = useDeployContestStore(state => state);
  const localISOTime = moment(votingOpen).format("YYYY-MM-DDTHH:mm");
  const minTime = moment(submissionOpen).format("YYYY-MM-DDTHH:mm");

  const onVotesOpenChange = (value: string) => {
    setVotingOpen(moment(value).toDate());
  };

  const invalidDate = useMemo<boolean>(() => {
    const isBefore = moment(votingOpen).isBefore(moment(submissionOpen));
    // if (isBefore) {
    //   setError({ message: "The voting date cannot be before the submission date." });
    // } else {
    //   setError(null);
    // }

    return isBefore;
  }, [submissionOpen, votingOpen]);

  return (
    <CreateDatePicker
      title="when time should submissions close— and voting open?"
      tip="one week lets you build momentum, but 50 minutes can be good during a live call—so design as you like!"
      onChange={onVotesOpenChange}
      defaultTime={localISOTime}
      minTime={minTime}
      invalidDate={invalidDate}
    />
  );
};

export default CreateVotesOpenDate;
