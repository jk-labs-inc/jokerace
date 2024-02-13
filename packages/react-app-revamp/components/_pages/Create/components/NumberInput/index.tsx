import { ChangeEventHandler, FC, useEffect, useState } from "react";

interface CreateNumberInputProps {
  value?: number;
  placeholder?: string;
  errorMessage?: string;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: number | null) => void;
  unitLabel?: string;
}

const CreateNumberInput: FC<CreateNumberInputProps> = ({
  value: propValue,
  placeholder,
  errorMessage,
  readOnly = false,
  className,
  unitLabel,
  onChange,
}) => {
  const [value, setValue] = useState<number | "">(propValue ?? 0);

  useEffect(() => {
    if (propValue === undefined) return;

    setValue(propValue);
  }, [propValue]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target;

    const match = value.match(/^\d*\.?\d{0,5}/); // match up to 5 decimal places

    if (match && match[0] !== value) {
      event.target.value = match[0];
    }

    const newValue = match ? match[0] : "";

    if (newValue === "") {
      setValue("");
      onChange?.(null);
    } else {
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue)) {
        setValue(parsedValue);
        onChange?.(parsedValue);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative flex w-full md:w-[216px] h-10 rounded-[10px] bg-neutral-14 ${
          readOnly ? "opacity-50" : ""
        } ${className}`}
      >
        <input
          type="number"
          className="w-full h-full outline-none bg-transparent pl-4 text-true-black"
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          min={0}
        />
        {unitLabel ? <span className="absolute inset-y-0 right-4 text-neutral-10 font-bold">{unitLabel}</span> : null}
      </div>
      {errorMessage ? <p className="text-[14px] font-bold text-negative-11">{errorMessage}</p> : null}
    </div>
  );
};

export default CreateNumberInput;
