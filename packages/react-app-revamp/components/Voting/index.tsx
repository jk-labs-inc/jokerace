import { toastInfo } from "@components/UI/Toast";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import VotingWidgetMobile from "./components/Mobile";
import VoteAmountInput from "./components/VoteAmountInput";
import VoteButton from "./components/VoteButton";
import VoteInfoSection from "./components/VoteInfoSection";
import VoteSlider from "./components/VoteSlider";

interface VotingWidgetProps {
  amountOfVotes: number;
  costToVote: number;
  chainId: number;
  balanceData: any; // TODO: proper type from wagmi
  isLoading: boolean;
  isVotingClosed: boolean;
  isContestCanceled: boolean;
  insufficientBalance: boolean;
  isCorrectNetwork: boolean;
  onVote?: (amount: number) => void;
  onAddFunds?: () => void;
  onSwitchChain?: (chainId: number) => Promise<void>;
}

export enum VotingButtonText {
  ADD_FUNDS = "add funds to vote",
  ADD_VOTES = "add votes to entry",
}

const VotingWidget: FC<VotingWidgetProps> = ({
  amountOfVotes,
  costToVote,
  chainId,
  balanceData,
  isLoading,
  isVotingClosed,
  isContestCanceled,
  insufficientBalance,
  isCorrectNetwork,
  onVote,
  onAddFunds,
  onSwitchChain,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const voteDisabled = isLoading || isInvalid || isNaN(amount) || amount === 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const [buttonText, setButtonText] = useState(VotingButtonText.ADD_VOTES);

  useEffect(() => {
    if (insufficientBalance) {
      setButtonText(VotingButtonText.ADD_FUNDS);
    } else {
      setButtonText(VotingButtonText.ADD_VOTES);
    }
  }, [insufficientBalance]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSliderChange = (value: any) => {
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

  const handleKeyDownSlider = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleVote();
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.target.value = event.target.value.replace(/[^0-9]*/g, "");
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ".") {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      handleVote();
    }
  };

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
  };

  const handleVote = async () => {
    if (!isCorrectNetwork && onSwitchChain) {
      await onSwitchChain(chainId);
    }

    if (isVotingClosed) {
      toastInfo({
        message: "Voting is closed for this contest",
      });
      return;
    }

    onVote?.(amount);
  };

  if (isContestCanceled) return null;

  if (isMobile) {
    return (
      <VotingWidgetMobile
        amount={amount}
        inputRef={inputRef}
        sliderValue={sliderValue}
        handleVote={handleVote}
        chainId={chainId}
        costToVote={costToVote}
        amountOfVotes={amountOfVotes}
        balanceData={balanceData}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        isInvalid={isInvalid}
        voteDisabled={voteDisabled}
        handleSliderChange={handleSliderChange}
        handleChange={handleAmountChange}
        handleKeyDownSlider={handleKeyDownSlider}
        handleKeyDownInput={handleKeyDownInput}
        handleInput={handleInput}
        onAddFunds={onAddFunds}
        insufficientBalance={insufficientBalance}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6">
            <VoteAmountInput
              amount={amount}
              amountOfVotes={amountOfVotes}
              isInvalid={isInvalid}
              isFocused={isFocused}
              inputRef={inputRef as RefObject<HTMLInputElement>}
              onAmountChange={handleAmountChange}
              onFocusChange={handleFocusChange}
              onKeyDown={handleKeyDownInput}
              onInput={handleInput}
            />
            <VoteSlider value={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
          </div>
          <VoteInfoSection
            balanceData={balanceData}
            amountOfVotes={amountOfVotes}
            costToVote={costToVote}
            voteAmount={amount}
            onAddFunds={onAddFunds}
          />
          <VoteButton buttonText={buttonText} isDisabled={voteDisabled} onVote={handleVote} onAddFunds={onAddFunds} />
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
