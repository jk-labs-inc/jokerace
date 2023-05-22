import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useEffect, useRef } from "react";

interface CreateTextInputProps {
  value: string;
  placeholder?: string;
  errorMessage?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  width?: number;
  onChange?: (value: string) => void;
  onNextStep?: () => void;
}

const CreateTextInput: FC<CreateTextInputProps> = ({
  value,
  placeholder,
  minLength = 100,
  maxLength = 100,
  readOnly = false,
  width = 600,
  onChange,
  onNextStep,
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
  }, [step, value, errors[step]]);

  return (
    <input
      ref={inputRef}
      value={value}
      type="text"
      className={`border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 pb-2 w-[${width}px]`}
      placeholder={placeholder}
      minLength={minLength}
      readOnly={readOnly}
      maxLength={maxLength}
      onChange={e => onChange?.(e.target.value)}
    />
  );
};

export default CreateTextInput;
