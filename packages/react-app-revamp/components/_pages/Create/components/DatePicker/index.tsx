import moment from "moment";
import { FC, useState } from "react";
import ErrorMessage from "../Error";

interface CreateDatePicker {
  title: string;
  invalidDate?: boolean;
  tip?: React.ReactNode;
  error?: string;
  minTime?: string;
  defaultTime?: string;
  onChange?: (value: string) => void;
}

const CreateDatePicker: FC<CreateDatePicker> = ({ title, tip, onChange, minTime, error, defaultTime }) => {
  const [dateTime, setDateTime] = useState(defaultTime || "");
  const minDateTime = moment().format("YYYY-MM-DDTHH:mm");

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(event.target.value);
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] md:text-[24px] font-bold text-primary-10">{title}</p>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={handleDateTimeChange}
        min={minTime || minDateTime}
        className="text-[18px] md:text-[24px] border-b border-neutral-11 bg-transparent pb-2 outline-noneplaceholder-neutral-9 w-[350px] focus:outline-none"
      />
      {error ? <ErrorMessage error={error} /> : <p className="text-[16px] text-neutral-11">{tip}</p>}
    </div>
  );
};

export default CreateDatePicker;
