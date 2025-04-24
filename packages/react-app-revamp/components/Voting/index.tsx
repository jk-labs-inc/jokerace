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
import { useMediaQuery } from "react-responsive";
import { useAccount, useBalance } from "wagmi";
import VotingWidgetMobile from "./components/Mobile";

interface VotingWidgetProps {
  proposalId: string;
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onAddFunds?: () => void;
}

export enum VotingButtonText {
  ADD_FUNDS = "add funds",
  ADD_VOTES = "add votes to entry",
}

const VotingWidget: FC<VotingWidgetProps> = ({ proposalId, amountOfVotes, downvoteAllowed, onVote, onAddFunds }) => {
  const { charge } = useContestStore(state => state);
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

  const handleVote = async () => {
    if (!isCorrectNetwork) {
      await switchChain(config, { chainId });
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
        downvoteAllowed={downvoteAllowed ?? false}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        isInvalid={isInvalid}
        voteDisabled={voteDisabled}
        handleClick={handleClick}
        handleSliderChange={handleSliderChange}
        handleChange={handleChange}
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6">
            <div
              className={`relative flex w-full  h-16 items-center px-8 text-[16px] bg-transparent font-bold ${
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
                placeholder="0"
                max={amountOfVotes}
                onKeyDown={handleKeyDownInput}
                onInput={handleInput}
                className="w-full text-[32px] bg-transparent outline-none placeholder-primary-5"
              />
              <span className="absolute right-4 text-neutral-9 text-[16px] font-bold">
                vote{amount !== 1 ? "s" : ""}
              </span>
            </div>
            <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <MyVotes balanceData={balanceData} amountOfVotes={amountOfVotes} charge={charge} />
              {charge ? <ChargeInfo charge={charge} /> : null}
            </div>
            {charge ? <TotalCharge charge={charge} amountOfVotes={amount} /> : null}
          </div>
          <ButtonV3
            type={ButtonType.TX_ACTION}
            isDisabled={buttonText === VotingButtonText.ADD_FUNDS ? false : voteDisabled}
            colorClass="px-[20px] bg-gradient-purple rounded-[40px] w-full"
            size={ButtonSize.FULL}
            onClick={buttonText === VotingButtonText.ADD_FUNDS ? onAddFunds : handleVote}
          >
            <span className="w-full text-center">{buttonText}</span>
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
