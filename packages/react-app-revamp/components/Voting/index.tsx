import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

interface VotingWidgetProps {
  proposalId: string;
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ proposalId, amountOfVotes, downvoteAllowed, onVote }) => {
  const { charge } = useContestStore(state => state);
  const asPath = usePathname();
  const { chainId: accountChainId } = useAccount();
  const { chainName } = extractPathSegments(asPath ?? "");
  const { isLoading } = useCastVotesStore(state => state);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const voteDisabled = isLoading || amount === 0 || isInvalid || isNaN(amount);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const isCorrectNetwork = chainId === accountChainId;
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClick = (value: boolean) => {
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    const newAmount = Math.round((value / 100) * amountOfVotes);

    // We are only doing this check because of the older contests, where the amount of votes was not rounded, we can remove this check in the future
    if (newAmount > amountOfVotes) {
      setAmount(parseFloat(amountOfVotes.toFixed(4)));
      return;
    } else {
      setAmount(newAmount);
    }

    const sliderPercentage = Math.round((newAmount / amountOfVotes) * 100);
    setSliderValue(sliderPercentage);
  };

  const handleChange = (value: string) => {
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

  const handleVote = () => {
    if (isCorrectNetwork) {
      onVote?.(amount, isUpvote);
    } else {
      onSwitchNetwork();
    }
  };

  const onSwitchNetwork = async () => {
    await switchChain(config, { chainId });
  };

  if (isContestCanceled) return null;

  return (
    <div className="flex flex-col gap-4 md:w-80">
      <hr className="hidden md:block border border-neutral-9" />
      <div className="flex flex-col gap-8">
        <p className="text-neutral-11 font-bold text-[20px]">add votes</p>
        <div className="flex flex-col -mt-[16px] md:-mt-0 gap-4">
          {downvoteAllowed ? (
            <div className="flex w-full border border-neutral-10 rounded-[25px] overflow-hidden text-[16px] text-center">
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  isUpvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
                }`}
                onClick={() => handleClick(true)}
              >
                upvote
              </div>
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  !isUpvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
                }`}
                onClick={() => handleClick(false)}
              >
                downvote
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <MyVotes amountOfVotes={amountOfVotes} charge={charge} chainId={chainId} />
              {charge ? <ChargeInfo charge={charge} /> : null}
            </div>
            <div
              className={`relative flex w-full md:w-80 h-16 items-center px-4 text-[16px] bg-transparent font-bold ${
                isInvalid ? "text-negative-11" : "text-neutral-11"
              } border-2 ${isFocused && !isInvalid ? "border-neutral-11" : isInvalid ? "border-negative-11" : "border-neutral-10"} rounded-[40px] transition-colors duration-300`}
            >
              <input
                ref={inputRef}
                type="number"
                value={amount || ""}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="0.00"
                max={amountOfVotes}
                onKeyDown={handleKeyDownInput}
                onInput={handleInput}
                className="w-full text-center text-[32px] bg-transparent outline-none placeholder-neutral-9"
              />
              <span className="absolute right-4 text-neutral-9 text-[16px] font-bold">
                vote{amount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
              {charge ? <TotalCharge charge={charge} amountOfVotes={amount} /> : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {isCorrectNetwork ? (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              isDisabled={voteDisabled}
              colorClass="px-[20px] bg-gradient-purple rounded-[40px] w-full"
              size={ButtonSize.FULL}
              onClick={() => onVote?.(amount, isUpvote)}
            >
              <span className="w-full text-center">add votes to entry</span>
            </ButtonV3>
          ) : (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              colorClass="flex items-center justify-center bg-gradient-vote rounded-[40px] w-full"
              size={ButtonSize.FULL}
              onClick={onSwitchNetwork}
            >
              switch network
            </ButtonV3>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
