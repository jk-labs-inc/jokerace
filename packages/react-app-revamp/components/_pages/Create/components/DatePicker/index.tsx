import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import ErrorMessage from "../Error";

interface CreateDatePicker {
  title: string;
  tip?: React.ReactNode;
  error?: string;
  minDate?: Date;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
}

const CustomInput = forwardRef<HTMLInputElement, { value: string; onClick: () => void }>(({ value, onClick }, ref) => (
  <div
    className="input-wrapper flex items-center justify-between w-full md:w-[400px] border-b border-neutral-11 bg-transparent outline-none focus:outline-none"
    onClick={onClick}
    ref={ref}
  >
    <input
      type="text"
      value={value}
      readOnly
      className="bg-transparent react-datepicker__input-text text-[18px] md:text-[24px]  placeholder-neutral-9 lowercase"
    />
    <span
      className="mb-[10px]"
      style={{
        backgroundImage: "url(/create-flow/calendar.png)",
        backgroundRepeat: "no-repeat",
        width: "41px",
        height: "43px",
        display: "inline-block",
        alignSelf: "stretch",
        cursor: "pointer",
      }}
    />
  </div>
));
CustomInput.displayName = "CustomInput";

const CreateDatePicker: React.FC<CreateDatePicker> = ({ title, tip, onChange, minDate, error, defaultDate }) => {
  const [startDate, setStartDate] = useState<Date | null>(defaultDate || null);

  const handleDateChange = (date: Date) => {
    setStartDate(date);
    onChange?.(date);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] md:text-[24px] font-bold text-primary-10">{title}</p>
      <div className="flex flex-col gap-2">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          showPopperArrow={false}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={minDate}
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [5, 10],
              },
            },
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
                altAxis: true,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: [],
              },
            },
          ]}
          customInput={
            <CustomInput
              value={""}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        {error ? <ErrorMessage error={error} /> : <p className="text-[16px] text-neutral-11">{tip}</p>}
      </div>
    </div>
  );
};

export default CreateDatePicker;
