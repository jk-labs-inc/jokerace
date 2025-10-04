import { useEffect, useRef, useState } from "react";

interface UseVoteAmountProps {
  amountOfVotes: number;
  userAddress?: string;
}

interface UseVoteAmountReturn {
  amount: number;
  sliderValue: number;
  isInvalid: boolean;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSliderChange: (value: number) => void;
  handleAmountChange: (value: string) => void;
  handleMaxClick: () => void;
  handleFocusChange: (focused: boolean) => void;
  handleInput: React.ChangeEventHandler<HTMLInputElement>;
  handleKeyDownInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  resetAmount: () => void;
}

export const useVoteAmount = ({ amountOfVotes, userAddress }: UseVoteAmountProps): UseVoteAmountReturn => {
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAddressRef = useRef<string | undefined>(userAddress);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (prevAddressRef.current && prevAddressRef.current !== userAddress && userAddress) {
      setAmount(0);
      setSliderValue(0);
      setIsInvalid(false);
    }
    prevAddressRef.current = userAddress;
  }, [userAddress]);

  const handleSliderChange = (value: number) => {
    const newAmount = Math.round((value / 100) * amountOfVotes);
    setAmount(newAmount);
    const sliderPercentage = Math.round((newAmount / amountOfVotes) * 100);
    setSliderValue(sliderPercentage);
  };

  const handleAmountChange = (value: string) => {
    const numericInput = parseInt(value, 10);
    setAmount(numericInput);

    const isInputInvalid = numericInput === 0 || numericInput > amountOfVotes;
    setIsInvalid(isInputInvalid);

    if (isInputInvalid) {
      if (numericInput === 0) {
        setSliderValue(0);
        return;
      } else if (numericInput > amountOfVotes) {
        setSliderValue(100);
      }
    } else {
      const sliderValue = Math.round((numericInput / amountOfVotes) * 100);
      setSliderValue(sliderValue);
    }
  };

  const handleMaxClick = () => {
    setAmount(amountOfVotes);
    setSliderValue(100);
    setIsFocused(true);
  };

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.target.value = event.target.value.replace(/[^0-9]*/g, "");
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ".") {
      e.preventDefault();
    }
  };

  const resetAmount = () => {
    setAmount(0);
    setSliderValue(0);
    setIsInvalid(false);
  };

  return {
    amount,
    sliderValue,
    isInvalid,
    isFocused,
    inputRef: inputRef as React.RefObject<HTMLInputElement>,
    handleSliderChange,
    handleAmountChange,
    handleMaxClick,
    handleFocusChange,
    handleInput,
    handleKeyDownInput,
    resetAmount,
  };
};
