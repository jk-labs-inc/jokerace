import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateSubmissionsOpenDate = () => {
  const { submissionOpen, setSubmissionOpen } = useDeployContestStore(state => state);

  const onSubmissionDateChange = (value: Date) => {
    setSubmissionOpen(value);
  };

  return (
    <CreateDatePicker
      title="what time should submissions open?"
      tip="we recommend opening them now—because why not?"
      onChange={onSubmissionDateChange}
      defaultDate={submissionOpen}
      minDate={submissionOpen}
    />
  );
};

export default CreateSubmissionsOpenDate;
