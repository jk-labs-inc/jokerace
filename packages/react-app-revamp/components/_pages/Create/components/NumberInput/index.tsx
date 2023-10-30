import { ChangeEventHandler, FC, useEffect, useState } from "react";

interface CreateNumberInputProps {
  value?: number;
  placeholder?: string;
  errorMessage?: string;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: number) => void;
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
    const newValue = event.target.value;

    if (!newValue) {
      setValue("");
      onChange?.(0);
      return;
    }

    const parsedValue = parseFloat(newValue);

    if (isNaN(parsedValue)) {
      setValue("");
      onChange?.(0);
      return;
    }

    setValue(parsedValue);
    onChange?.(parsedValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative flex w-full md:w-[200px] h-8 border rounded-[10px] bg-transparent border-neutral-10 ${
          readOnly ? "opacity-50" : ""
        } ${className}`}
      >
        <input
          type="number"
          className="font-bold w-full h-full outline-none bg-transparent text-center"
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
        />
        {unitLabel && <span className="absolute inset-y-0 right-4 text-neutral-10 font-bold">{unitLabel}</span>}
      </div>
      {errorMessage ? <p className="text-[16px] font-bold text-negative-11">{errorMessage}</p> : null}
    </div>
  );
};

export default CreateNumberInput;
