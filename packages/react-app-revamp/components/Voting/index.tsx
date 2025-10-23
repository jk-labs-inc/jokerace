import useContestConfigStore from "@hooks/useContestConfig/store";
import { useVoteBalance } from "@hooks/useVoteBalance";
import { FC, RefObject, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import VotingWidgetEmailSignup from "./components/EmailSignup";
import VotingWidgetRewardsProjection from "./components/RewardsProjection";
import VoteAmountInput from "./components/VoteAmountInput";
import VoteButton from "./components/VoteButton";
import VoteInfoBlocks from "./components/VoteInfoBlocks";
import VoteSlider from "./components/VoteSlider";
import { useVoteExecution } from "./hooks/useVoteExecution";
import { useVotingStore } from "./store";

export enum VotingWidgetStyle {
  classic = "classic",
  colored = "colored",
}

interface VotingWidgetProps {
  costToVote: string;
  costToVoteRaw: bigint;
  isLoading: boolean;
  isVotingClosed: boolean;
  isContestCanceled: boolean;
  submissionsCount: number;
  style?: VotingWidgetStyle;
  onVote?: (amountOfVotes: number) => void;
  onAddFunds?: () => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({
  costToVote,
  costToVoteRaw,
  isLoading,
  isVotingClosed,
  isContestCanceled,
  submissionsCount,
  style = VotingWidgetStyle.classic,
  onVote,
  onAddFunds,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { address: userAddress, isConnected } = useAccount();
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const inputRef = useRef<HTMLInputElement>(null);
  const { inputValue, sliderValue, setSliderValue, isInvalid, reset } = useVotingStore(
    useShallow(state => ({
      inputValue: state.inputValue,
      sliderValue: state.sliderValue,
      setSliderValue: state.setSliderValue,
      isInvalid: state.isInvalid,
      reset: state.reset,
    })),
  );
  const {
    balance,
    insufficientBalance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useVoteBalance({
    chainId: contestConfig.chainId,
    costToVote,
    inputValue,
  });
  const { handleVote } = useVoteExecution({
    costToVote,
    isVotingClosed,
    onVote,
  });

  useEffect(() => {
    if (isMobile) return;

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    reset();
  }, [userAddress, reset]);

  const voteDisabled = isBalanceLoading || isLoading || isInvalid || !inputValue || inputValue === "0";

  const handleKeyDownSlider = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleVote();
    }
  };

  const handleKeyDownInputWithVote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVote();
    }
  };

  if (isContestCanceled) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <VoteAmountInput
            maxBalance={balance?.formatted || "0"}
            symbol={contestConfig.chainNativeCurrencySymbol}
            isConnected={isConnected}
            style={style}
            inputRef={inputRef as RefObject<HTMLInputElement>}
            onKeyDown={handleKeyDownInputWithVote}
          />
          <VoteInfoBlocks
            type="my-votes"
            balance={isBalanceError ? "Error loading balance" : balance?.formatted || "0"}
            symbol={contestConfig.chainNativeCurrencySymbol}
            insufficientBalance={insufficientBalance}
            isConnected={isConnected}
            onAddFunds={onAddFunds}
          />
        </div>
        <VoteSlider
          value={sliderValue}
          onChange={value => setSliderValue(value, balance?.formatted || "0", isConnected)}
          onKeyDown={handleKeyDownSlider}
        />
        <div className="flex flex-col gap-2">
          <VoteInfoBlocks type="charge-info" costToVote={costToVote} costToVoteRaw={costToVoteRaw} />
          <VoteInfoBlocks type="total-votes" costToVote={costToVote} spendableBalance={balance?.formatted || "0"} />
        </div>
        <VotingWidgetRewardsProjection
          currentPricePerVote={costToVoteRaw}
          inputValue={inputValue}
          submissionsCount={submissionsCount}
        />
      </div>
      <VotingWidgetEmailSignup />
      <VoteButton
        isDisabled={voteDisabled}
        isInvalidBalance={insufficientBalance && isConnected}
        isConnected={isConnected}
        onVote={handleVote}
        onAddFunds={onAddFunds}
      />
    </div>
  );
};

export default VotingWidget;
