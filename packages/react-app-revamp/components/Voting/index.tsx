import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC, RefObject } from "react";
import { useShallow } from "zustand/shallow";
import VoteAmountInput from "./components/VoteAmountInput";
import VoteButton from "./components/VoteButton";
import VoteInfoBlocks from "./components/VoteInfoBlocks";
import VoteSlider from "./components/VoteSlider";
import { useVoteAmount } from "./hooks/useVoteAmount";
import { useVoteBalance } from "./hooks/useVoteBalance";
import { useVoteExecution } from "./hooks/useVoteExecution";

export enum VotingWidgetStyle {
  classic = "classic",
  colored = "colored",
}

interface VotingWidgetProps {
  amountOfVotes: number;
  costToVote: number;
  isLoading: boolean;
  isVotingClosed: boolean;
  isContestCanceled: boolean;
  style?: VotingWidgetStyle;
  onVote?: (amount: number) => void;
  onAddFunds?: () => void;
}

//TODO: add mobile version
const VotingWidget: FC<VotingWidgetProps> = ({
  amountOfVotes,
  costToVote,
  isLoading,
  isVotingClosed,
  isContestCanceled,
  style = VotingWidgetStyle.classic,
  onVote,
  onAddFunds,
}) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const {
    balance,
    insufficientBalance,
    isCorrectNetwork,
    contestChainId,
    chainNativeCurrencySymbol,
    userAddress,
    isBalanceLoading,
    isBalanceError,
  } = useVoteBalance(costToVote);
  const {
    amount,
    sliderValue,
    isInvalid,
    isFocused,
    inputRef,
    handleSliderChange,
    handleAmountChange,
    handleMaxClick,
    handleFocusChange,
    handleInput,
    handleKeyDownInput,
    resetAmount,
  } = useVoteAmount({ amountOfVotes, userAddress });
  const { showMaxVotesDialog, handleVote, handleMaxVoteConfirm, handleMaxVoteCancel, getTotalCost } = useVoteExecution({
    amount,
    amountOfVotes,
    isCorrectNetwork,
    contestChainId,
    isVotingClosed,
    onVote,
    onCancelMaxVotes: resetAmount,
  });

  const voteDisabled = isLoading || isInvalid || isNaN(amount) || amount === 0 || isBalanceLoading;

  const handleKeyDownSlider = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleVote();
    }
  };

  const handleKeyDownInputWithVote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDownInput(e);
    if (e.key === "Enter") {
      handleVote();
    }
  };

  if (isContestCanceled) return null;

  return (
    <div className="flex flex-col gap-6">
      {showMaxVotesDialog ? (
        <DialogMaxVotesAlert
          token={chainNativeCurrencySymbol}
          totalCost={getTotalCost()}
          onConfirm={handleMaxVoteConfirm}
          onCancel={handleMaxVoteCancel}
        />
      ) : (
        <>
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
                onKeyDown={handleKeyDownInputWithVote}
                onInput={handleInput}
                onMaxClick={handleMaxClick}
              />
              <VoteInfoBlocks
                type="my-votes"
                balance={isBalanceError ? "Error loading balance" : balance?.formatted || "0"}
                symbol={contestConfig.chainNativeCurrencySymbol}
                insufficientBalance={insufficientBalance}
                onAddFunds={onAddFunds}
              />
            </div>
            <VoteSlider value={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
            <VoteInfoBlocks type="charge-info" />
            <VoteInfoBlocks type="total-charge" amountOfVotes={amount} />
          </div>
          <VoteButton
            isDisabled={voteDisabled}
            isInvalidBalance={insufficientBalance}
            onVote={handleVote}
            onAddFunds={onAddFunds}
          />
        </>
      )}
    </div>
  );
};

export default VotingWidget;
