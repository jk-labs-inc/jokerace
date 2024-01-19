import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useEffect, useRef } from "react";

interface CreateTextInputProps {
  value?: string | number;
  type?: "text" | "number";
  placeholder?: string;
  errorMessage?: string;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onNextStep?: () => void;
  onClick?: () => void;
}

const CreateTextInput: FC<CreateTextInputProps> = ({
  value,
  type = "text",
  placeholder,
  max,
  min,
  minLength = 100,
  maxLength = 100,
  readOnly = false,
  className,
  onChange,
  onNextStep,
  onClick,
}) => {
  const { step } = useDeployContestStore(state => state);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e: { key: any }) => {
      switch (e.key) {
        case "Enter":
          onNextStep?.();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNextStep, step, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === "number" && newValue) {
      let val = parseFloat(newValue);

      if (min !== undefined && val < min) {
        val = min;
      } else if (max !== undefined && val > max) {
        val = max;
      }

      newValue = isNaN(val) ? newValue : val.toString();
    }

    onChange?.(newValue);
  };

  return (
    <input
      ref={inputRef}
      value={value}
      type={type}
      onClick={onClick}
      className={`border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 pb-2 ${className}`}
      placeholder={placeholder}
      readOnly={readOnly}
      min={min}
      max={max}
      maxLength={maxLength}
      minLength={minLength}
      onChange={handleChange}
    />
  );
};

export default CreateTextInput;
