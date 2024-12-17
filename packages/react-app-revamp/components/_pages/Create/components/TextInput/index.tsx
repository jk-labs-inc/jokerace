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
    <div className="flex flex-col gap-2">
      <p className="text-[20px] font-bold text-neutral-11">
        contest title <span className="font-normal">(required)</span>
      </p>
      <div
        className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black md:shadow-file-upload md:p-2`}
      >
        <input
          ref={inputRef}
          value={value}
          type="text"
          onClick={onClick}
          className="text-[16px] bg-secondary-1 outline-none rounded-[16px] placeholder-neutral-10 w-full h-12 indent-4 focus:outline-none"
          placeholder={placeholder}
          readOnly={readOnly}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CreateTextInput;
