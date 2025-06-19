import { toastInfo } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useBalance } from "wagmi";
import VotingWidgetMobile from "./components/Mobile";
import VoteAmountInput from "./components/VoteAmountInput";
import VoteButton from "./components/VoteButton";
import VoteInfoSection from "./components/VoteInfoSection";
import VoteSlider from "./components/VoteSlider";

interface VotingWidgetProps {
  proposalId: string;
  amountOfVotes: number;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onAddFunds?: () => void;
}

export enum VotingButtonText {
  ADD_FUNDS = "add funds to vote",
  ADD_VOTES = "add votes to entry",
}

const VotingWidget: FC<VotingWidgetProps> = ({ proposalId, amountOfVotes, onVote, onAddFunds }) => {
  const { charge } = useContestStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const isVotingClosed = contestStatus === ContestStatus.VotingClosed;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const asPath = usePathname();
  const { chainId: accountChainId, address: userAddress } = useAccount();
  const { chainName } = extractPathSegments(asPath ?? "");
  const { isLoading } = useCastVotesStore(state => state);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const voteDisabled = isLoading || isInvalid || isNaN(amount);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const isCorrectNetwork = chainId === accountChainId;
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const inputRef = useRef<HTMLInputElement>(null);
  const [buttonText, setButtonText] = useState(VotingButtonText.ADD_VOTES);
  const { data: balanceData } = useBalance({
    address: userAddress,
    chainId,
  });
  const insufficientBalance = charge && balanceData ? balanceData.value < BigInt(charge.type.costToVote) : false;

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

  const handleVoteTypeChange = (value: boolean) => {
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    const newAmount = Math.round((value / 100) * amountOfVotes);

    // we are only doing this check because of the older contests, where the amount of votes was not rounded, we can remove this check in the future
    if (newAmount > amountOfVotes) {
      setAmount(parseFloat(amountOfVotes.toFixed(4)));
      return;
    } else {
      setAmount(newAmount);
    }

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
    if (!isCorrectNetwork) {
      await switchChain(config, { chainId });
    }

    if (isVotingClosed) {
      toastInfo("Voting is closed for this contest");
      return;
    }

    onVote?.(amount, isUpvote);
  };

  if (isContestCanceled) return null;

  if (isMobile) {
    return (
      <VotingWidgetMobile
        amount={amount}
        inputRef={inputRef}
        sliderValue={sliderValue}
        isUpvote={isUpvote}
        handleVote={handleVote}
        chainId={chainId}
        charge={charge}
        amountOfVotes={amountOfVotes}
        balanceData={balanceData}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        isInvalid={isInvalid}
        voteDisabled={voteDisabled}
        handleClick={handleVoteTypeChange}
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
            charge={charge}
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
