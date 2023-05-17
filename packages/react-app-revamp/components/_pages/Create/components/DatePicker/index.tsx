import moment from "moment";
import { FC, useEffect, useState } from "react";

interface CreateDatePicker {
  title: string;
  invalidDate?: boolean;
  tip?: React.ReactNode;
  minTime?: string;
  defaultTime?: string;
  onChange?: (value: string) => void;
}

const CreateDatePicker: FC<CreateDatePicker> = ({ title, tip, onChange, minTime, defaultTime }) => {
  const [dateTime, setDateTime] = useState(defaultTime || "");
  const minDateTime = moment().format("YYYY-MM-DDTHH:mm");

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(event.target.value);
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[24px] font-normal text-primary-10">{title}</p>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={handleDateTimeChange}
        min={minTime || minDateTime}
        className="text-[24px] border-b border-neutral-11 bg-transparent pb-2 outline-noneplaceholder-neutral-9 w-[350px] focus:outline-none"
      />
      <p className="text-[16px] text-neutral-11">{tip}</p>
    </div>
  );
};

export default CreateDatePicker;
