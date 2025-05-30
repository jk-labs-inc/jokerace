import { FC, RefObject } from "react";

interface VoteAmountInputProps {
  amount: number;
  amountOfVotes: number;
  isInvalid: boolean;
  isFocused: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onAmountChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput: React.ChangeEventHandler<HTMLInputElement>;
}

const VoteAmountInput: FC<VoteAmountInputProps> = ({
  amount,
  amountOfVotes,
  isInvalid,
  isFocused,
  inputRef,
  onAmountChange,
  onFocusChange,
  onKeyDown,
  onInput,
}) => {
  return (
    <div
      className={`relative flex w-full h-16 items-center px-8 text-[16px] bg-transparent font-bold ${
        isInvalid ? "text-negative-11" : "text-neutral-11"
      } border-2 ${
        isFocused && !isInvalid ? "border-neutral-11" : isInvalid ? "border-negative-11" : "border-neutral-10"
      } rounded-[40px] transition-colors duration-300`}
    >
      <input
        ref={inputRef}
        type="number"
        value={amount || ""}
        onChange={e => onAmountChange(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        placeholder="0"
        max={amountOfVotes}
        onKeyDown={onKeyDown}
        onInput={onInput}
        className="w-full text-[32px] bg-transparent outline-none placeholder-primary-5"
      />
      <span className="absolute right-4 text-neutral-9 text-[16px] font-bold">vote{amount !== 1 ? "s" : ""}</span>
    </div>
  );
};

export default VoteAmountInput;
