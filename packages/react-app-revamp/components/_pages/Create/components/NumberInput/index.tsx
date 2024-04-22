import { ChangeEventHandler, FC, useEffect, useState } from "react";

interface CreateNumberInputProps {
  value?: number;
  disableDecimals?: boolean;
  placeholder?: string;
  errorMessage?: string;
  readOnly?: boolean;
  className?: string;
  textClassName?: string;
  onChange?: (value: number | null) => void;
  unitLabel?: string;
}

const CreateNumberInput: FC<CreateNumberInputProps> = ({
  value: propValue,
  disableDecimals,
  placeholder,
  errorMessage,
  readOnly = false,
  className,
  textClassName,
  unitLabel,
  onChange,
}) => {
  const [value, setValue] = useState<number | "">(propValue ?? "");

  useEffect(() => {
    if (propValue === undefined) return;

    setValue(propValue);
  }, [propValue]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target;

    if (value === "") {
      setValue("");
      onChange?.(null);
    } else {
      const parsedValue = disableDecimals ? parseInt(value, 10) : parseFloat(value);
      if (!isNaN(parsedValue)) {
        setValue(parsedValue);
        onChange?.(parsedValue);
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (disableDecimals && event.key === ".") {
      event.preventDefault();
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (disableDecimals) {
      event.target.value = event.target.value.replace(/[^0-9]*/g, "");
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
          className={`${className} ${textClassName} text-[20px] w-full h-full outline-none bg-transparent pl-4 text-true-black  placeholder-neutral-10`}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          min={0}
        />
        {unitLabel ? (
          <span className="text-[20px] absolute inset-y-1 right-4 text-primary-2 font-bold">{unitLabel}</span>
        ) : null}
      </div>
      {errorMessage ? <p className="text-[14px] font-bold text-negative-11">{errorMessage}</p> : null}
    </div>
  );
};

export default CreateNumberInput;
