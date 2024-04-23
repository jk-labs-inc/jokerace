import { FC, useRef } from "react";

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
}) => {
  const inputRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    onChange?.(newValue);
  };

  return (
    <input
      ref={inputRef}
      value={value}
      type="text"
      onClick={onClick}
      className={`border-b border-neutral-11 rounded-none bg-transparent outline-none placeholder-neutral-10 placeholder-bold pb-2 ${className}`}
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
