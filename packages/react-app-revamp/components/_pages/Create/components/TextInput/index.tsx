import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useEffect, useRef } from "react";

interface CreateTextInputProps {
  value?: string | number;
  type?: "text" | "number";
  placeholder?: string;
  errorMessage?: string;
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
  minLength = 100,
  maxLength = 100,
  readOnly = false,
  className,
  onChange,
  onNextStep,
  onClick,
}) => {
  const { step, errors } = useDeployContestStore(state => state);
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

  return (
    <input
      ref={inputRef}
      value={value}
      type={type}
      onClick={onClick}
      className={`border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 pb-2 ${className}`}
      placeholder={placeholder}
      minLength={minLength}
      readOnly={readOnly}
      maxLength={maxLength}
      onChange={e => onChange?.(e.target.value)}
    />
  );
};

export default CreateTextInput;
