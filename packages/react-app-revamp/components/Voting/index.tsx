import { toastInfo } from "@components/UI/Toast";
import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import VoteAmountInput from "./components/VoteAmountInput";
import VoteButton from "./components/VoteButton";
import VoteInfoBlocks from "./components/VoteInfoBlocks";
import VoteSlider from "./components/VoteSlider";

export enum VotingWidgetStyle {
  classic = "classic",
  colored = "colored",
}

interface VotingWidgetProps {
  amountOfVotes: number;
  isLoading: boolean;
  isVotingClosed: boolean;
  isContestCanceled: boolean;
  style?: VotingWidgetStyle;
  onVote?: (amount: number) => void;
  onAddFunds?: () => void;
  onSwitchChain?: (chainId: number) => Promise<void>;
}

const VotingWidget: FC<VotingWidgetProps> = ({
  amountOfVotes,
  isLoading,
  isVotingClosed,
  isContestCanceled,
  style = VotingWidgetStyle.classic,
  onVote,
  onAddFunds,
  onSwitchChain,
}) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const contestChainId = contestConfig.chainId;
  const { chainId: userChainId, address: userAddress = "" } = useAccount();
  const { votingClose } = useContestStore(useShallow(state => ({ votingClose: state.votesClose })));
  const isCorrectNetwork = userChainId === contestChainId;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [showMaxVotesDialog, setShowMaxVotesDialog] = useState(false);
  const voteDisabled = isLoading || isInvalid || isNaN(amount) || amount === 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentPricePerVote } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose,
  });

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

  const handleMaxClick = () => {
    setAmount(amountOfVotes);
    setSliderValue(100);
    // When clicking max, also set focus to trigger validation
    setIsFocused(true);
  };

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
  };

  const handleVote = async () => {
    if (!isCorrectNetwork && onSwitchChain) {
      await onSwitchChain(contestChainId);
    }

    if (isVotingClosed) {
      toastInfo({
        message: "Voting is closed for this contest",
      });
      return;
    }

    if (amount === amountOfVotes) {
      setShowMaxVotesDialog(true);
      return;
    }

    onVote?.(amount);
  };

  const handleMaxVoteConfirm = () => {
    setShowMaxVotesDialog(false);
    onVote?.(amount);
  };

  const handleMaxVoteCancel = () => {
    setShowMaxVotesDialog(false);
  };

  if (isContestCanceled) return null;

  // if (isMobile) {
  //   return (
  //     <VotingWidgetMobile
  //       amount={amount}
  //       inputRef={inputRef}
  //       sliderValue={sliderValue}
  //       handleVote={handleVote}
  //       chainId={chainId}
  //       costToVote={costToVote}
  //       amountOfVotes={amountOfVotes}
  //       balanceData={balanceData}
  //       isFocused={isFocused}
  //       setIsFocused={setIsFocused}
  //       isInvalid={isInvalid}
  //       voteDisabled={voteDisabled}
  //       handleSliderChange={handleSliderChange}
  //       handleChange={handleAmountChange}
  //       handleKeyDownSlider={handleKeyDownSlider}
  //       handleKeyDownInput={handleKeyDownInput}
  //       handleInput={handleInput}
  //       onAddFunds={onAddFunds}
  //       insufficientBalance={insufficientBalance}
  //     />
  //   );
  // }

  const getTotalCost = () => {
    if (!currentPricePerVote || !amount) return "0";
    return getTotalCharge(amount, currentPricePerVote);
  };

  if (showMaxVotesDialog) {
    return (
      <DialogMaxVotesAlert
        token={contestConfig.chainNativeCurrencySymbol}
        totalCost={getTotalCost()}
        onConfirm={handleMaxVoteConfirm}
        onCancel={handleMaxVoteCancel}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <VoteAmountInput
            amount={amount}
            amountOfVotes={amountOfVotes}
            isInvalid={isInvalid}
            isFocused={isFocused}
            style={style}
            inputRef={inputRef as RefObject<HTMLInputElement>}
            onAmountChange={handleAmountChange}
            onFocusChange={handleFocusChange}
            onKeyDown={handleKeyDownInput}
            onInput={handleInput}
            onMaxClick={handleMaxClick}
          />
          <VoteInfoBlocks
            type="my-votes"
            userAddress={userAddress}
            amountOfVotes={amountOfVotes}
            onAddFunds={onAddFunds}
          />
        </div>
        <VoteSlider value={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
        <VoteInfoBlocks type="charge-info" />
        <VoteInfoBlocks type="total-charge" amountOfVotes={amount} />
      </div>
      <VoteButton isDisabled={voteDisabled} onVote={handleVote} />
    </div>
  );
};

export default VotingWidget;
