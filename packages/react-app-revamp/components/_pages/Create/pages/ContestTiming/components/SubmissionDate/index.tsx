import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import moment from "moment";

const CreateSubmissionsOpenDate = () => {
  const localISOTime = moment().format("YYYY-MM-DDTHH:mm");

  const onSubmissionDateChange = (value: string) => {};

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
