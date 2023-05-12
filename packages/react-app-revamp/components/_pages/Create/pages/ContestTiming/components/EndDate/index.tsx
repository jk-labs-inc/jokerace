import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import moment from "moment";

const CreateEndContestDate = () => {
  const localISOTime = moment().add(14, "days").format("YYYY-MM-DDTHH:mm");

  const onEndContesDateChange = (value: string) => {};

  return (
    <CreateDatePicker
      title="what time should voting close?"
      tip="yup: one week builds momentum, but 10-30 minutes lets everyone compete live, so design as you like"
      onChange={onEndContesDateChange}
      defaultTime={localISOTime}
    />
  );
};

export default CreateEndContestDate;
