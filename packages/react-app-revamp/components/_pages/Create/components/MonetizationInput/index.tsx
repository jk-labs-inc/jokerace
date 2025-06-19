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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);
    setWidth(newValue.length || 1); // at least 1ch for empty input

    const numericValue = newValue === "" ? 0 : Number(newValue);
    onChange?.(numericValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline">
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={0}
          placeholder="0.00"
          className="bg-transparent box-content font-bold border-b outline-none text-neutral-11 placeholder:text-neutral-9 text-[40px]"
          style={{ width: Math.max(width, 4) + "ch" }}
        />
        <span className="text-neutral-10 text-[40px] uppercase font-bold">{label}</span>
      </div>

      <div className={`transition-all duration-200 ${errorMessage ? "min-h-[20px]" : "min-h-0"}`}>
        {errorMessage && <p className="text-negative-11 text-[14px] font-bold animate-reveal">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CreateFlowMonetizationInput;
