import { FC, useEffect, useState } from "react";

interface CreateFlowMonetizationInputProps {
  value: number;
  label: string;
  errorMessage?: string;
  onChange?: (value: number) => void;
}

const CreateFlowMonetizationInput: FC<CreateFlowMonetizationInputProps> = ({
  value,
  label,
  errorMessage,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setInputValue(value.toString());
    const valueString = value.toString();
    const dotCount = (valueString.match(/\./g) || []).length;
    const adjustedWidth = valueString.length - dotCount * 0.5;
    setWidth(adjustedWidth);
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    const cleanedValue = target.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

    target.value = cleanedValue;
    setInputValue(cleanedValue);

    // Adjust width calculation to account for narrower "." characters
    const dotCount = (cleanedValue.match(/\./g) || []).length;
    const adjustedWidth = cleanedValue.length - dotCount * 0.5; // Subtract 0.5ch for each dot
    setWidth(adjustedWidth || 1);

    const numericValue = cleanedValue === "" ? 0 : Number(cleanedValue);
    onChange?.(numericValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline">
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onInput={handleInput}
          placeholder="0"
          style={{ width: `${width}ch` }}
          className="bg-transparent box-content font-bold border-b outline-none text-neutral-11 placeholder:text-neutral-9 text-[40px]"
        />
        <span className="text-neutral-10 text-[40px] uppercase font-bold">{label}</span>
      </div>
      {errorMessage && <p className="text-negative-11 text-[14px] font-bold animate-fade-in">{errorMessage}</p>}
    </div>
  );
};

export default CreateFlowMonetizationInput;
