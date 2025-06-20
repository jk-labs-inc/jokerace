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
    setWidth(value.toString().length);
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    const cleanedValue = target.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

    target.value = cleanedValue;
    setInputValue(cleanedValue);
    setWidth(cleanedValue.length || 1);

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
          className="bg-transparent box-content font-bold border-b outline-none text-neutral-11 placeholder:text-neutral-9 text-[40px]"
          style={{ width: Math.max(width, 1) + "ch" }}
        />
        <span className="text-neutral-10 text-[40px] uppercase font-bold">{label}</span>
      </div>
      {errorMessage && <p className="text-negative-11 text-[14px] font-bold animate-reveal">{errorMessage}</p>}
    </div>
  );
};

export default CreateFlowMonetizationInput;
