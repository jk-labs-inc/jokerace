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
          placeholder="0.00"
          className="bg-transparent box-content font-bold border-b outline-none text-neutral-11 placeholder:text-neutral-9 text-[40px]"
          style={{ width: Math.max(width, 4) + "ch" }}
        />
        <span className="text-neutral-10 text-[40px] uppercase font-bold ml-2">{label}</span>
      </div>
      {errorMessage && <p className="text-negative-11 text-[14px] font-bold animate-reveal">{errorMessage}</p>}
    </div>
  );
};

export default CreateFlowMonetizationInput;
