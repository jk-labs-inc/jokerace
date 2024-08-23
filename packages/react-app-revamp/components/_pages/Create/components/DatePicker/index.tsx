import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ErrorMessage from "../Error";

interface CreateDatePicker {
  error?: string;
  minDate?: Date;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
}

const CustomInput = forwardRef<HTMLInputElement, { value: string; onClick: () => void }>(({ value, onClick }, ref) => (
  <div
    className="input-wrapper flex cursor-pointer bg-neutral-14 h-10 px-4 py-2 rounded-[5px] items-center w-full md:w-[400px] outline-none focus:outline-none"
    onClick={onClick}
    ref={ref}
  >
    <p className="text-[18px] md:text-[20px] text-true-black">{value}</p>
    <Image width={32} height={32} src="/create-flow/calendar.svg" alt="calendar" className="ml-auto" />
  </div>
));

CustomInput.displayName = "CustomInput";

const CreateDatePicker: React.FC<CreateDatePicker> = ({ onChange, minDate, error, defaultDate }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!defaultDate) return;

    setStartDate(defaultDate);
  }, [defaultDate]);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);

    if (date && onChange) {
      onChange(date);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        showPopperArrow={false}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={1}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa z"
        minDate={minDate}
        popperClassName="popper-custom"
        customInput={
          <CustomInput
            value={""}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />
      {error ? <ErrorMessage error={error} /> : null}
    </div>
  );
};

export default CreateDatePicker;
