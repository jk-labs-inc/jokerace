import { VotingWidgetStyle } from "@components/Voting";
import { FC, RefObject } from "react";
import { motion } from "motion/react";

interface VoteAmountInputProps {
  amount: number;
  amountOfVotes: number;
  isInvalid: boolean;
  isFocused: boolean;
  inputRef: RefObject<HTMLInputElement>;
  style?: VotingWidgetStyle;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
  onAmountChange?: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onMaxClick?: () => void;
}

const VoteAmountInput: FC<VoteAmountInputProps> = ({
  amount,
  amountOfVotes,
  isInvalid,
  isFocused,
  style = VotingWidgetStyle.classic,
  inputRef,
  onAmountChange,
  onFocusChange,
  onKeyDown,
  onInput,
  onMaxClick,
}) => {
  return (
    <div
      className={`relative flex w-full h-[72px] items-center px-8 text-[16px] ${
        style === VotingWidgetStyle.colored ? "bg-secondary-13" : "bg-transparent"
      } font-bold ${isInvalid ? "text-negative-11" : "text-neutral-11"} border ${
        isFocused && !isInvalid ? "border-secondary-14" : isInvalid ? "border-negative-11" : "border-secondary-14"
      } rounded-[40px] transition-colors duration-300`}
    >
      <input
        ref={inputRef}
        type="number"
        value={amount || ""}
        onChange={e => onAmountChange?.(e.target.value)}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        placeholder="0"
        max={amountOfVotes}
        onKeyDown={onKeyDown}
        onInput={onInput}
        className="w-full text-[40px] bg-transparent outline-none placeholder-primary-5 pr-20"
      />
      <motion.button
        onClick={onMaxClick}
        className="absolute w-20 h-6 bg-primary-14 rounded-[40px] right-4 text-positive-11 text-[16px] border-secondary-14 border font-bold flex items-center justify-center"
        style={{ willChange: "transform" }}
        whileTap={{ scale: 0.97 }}
      >
        max
      </motion.button>
    </div>
  );
};

export default VoteAmountInput;
