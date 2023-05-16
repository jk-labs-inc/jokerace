import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";
import { FC } from "react";

const CreateSubmissionsOpenDate = () => {
  const { submissionOpen, setSubmissionOpen } = useDeployContestStore(state => state);
  const localISOTime = moment(submissionOpen).format("YYYY-MM-DDTHH:mm");

  const onSubmissionDateChange = (value: string) => {
    setSubmissionOpen(moment(value).toDate());
  };

  return (
    <CreateDatePicker
      title="what time should submissions open?"
      tip="we recommend opening them now—because why not?"
      onChange={onSubmissionDateChange}
      defaultTime={localISOTime}
    />
  );
};

export default CreateSubmissionsOpenDate;
