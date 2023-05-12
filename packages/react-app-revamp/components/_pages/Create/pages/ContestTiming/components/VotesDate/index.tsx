import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import moment from "moment";

const CreateVotesOpenDate = () => {
  const localISOTime = moment().add(7, "days").format("YYYY-MM-DDTHH:mm");

  const onVotesOpenChange = (value: string) => {};

  return (
    <CreateDatePicker
      title="when time should submissions close— and voting open?"
      tip="one week lets you build momentum, but 50 minutes can be good during a live call—so design as you like!"
      onChange={onVotesOpenChange}
      defaultTime={localISOTime}
    />
  );
};

export default CreateVotesOpenDate;
