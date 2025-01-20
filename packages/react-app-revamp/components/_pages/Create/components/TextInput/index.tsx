import { FC, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface CreateTextInputProps {
  value?: string;
  placeholder?: string;
  errorMessage?: string;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  showChevron?: boolean;
  isChevronUp?: boolean;
}

const CreateTextInput: FC<CreateTextInputProps> = ({
  value,
  placeholder,
  max,
  min,
  minLength = 100,
  maxLength = 100,
  readOnly = false,
  className,
  onChange,
  onClick,
  showChevron = false,
  isChevronUp = false,
}) => {
  const inputRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    onChange?.(newValue);
  };

  return (
    <div
      className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black md:shadow-file-upload md:p-2 relative`}
    >
      <input
        ref={inputRef}
        value={value}
        type="text"
        onClick={onClick}
        className={`text-[16px] bg-secondary-1 outline-none rounded-[16px] placeholder-neutral-10 w-full h-12 indent-4 focus:outline-none ${
          showChevron ? "pr-10" : ""
        }`}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        max={max}
        maxLength={maxLength}
        minLength={minLength}
        onChange={handleChange}
      />
      {showChevron && (
        <ChevronDownIcon
          className={`w-5 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
            isChevronUp ? "rotate-180" : "rotate-0"
          }`}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default CreateTextInput;
