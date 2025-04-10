import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface VotingWidgetMobileProps {
  downvoteAllowed: boolean;
  isUpvote: boolean;
  isInvalid: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  amount: number;
  amountOfVotes: number;
  isFocused: boolean;
  sliderValue: number;
  charge: Charge | null;
  chainId: number;
  voteDisabled: boolean;
  handleVote: () => void;
  handleChange: (value: string) => void;
  handleKeyDownInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleKeyDownSlider: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleSliderChange: (value: number) => void;
  handleClick: (isUpvote: boolean) => void;
  setIsFocused: (value: boolean) => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFunds?: () => void;
}

const VotingWidgetMobile: FC<VotingWidgetMobileProps> = ({
  downvoteAllowed,
  isUpvote,
  isInvalid,
  inputRef,
  amount,
  amountOfVotes,
  isFocused,
  handleVote,
  handleChange,
  handleKeyDownInput,
  handleKeyDownSlider,
  handleSliderChange,
  handleClick,
  setIsFocused,
  handleInput,
  sliderValue,
  charge,
  chainId,
  voteDisabled,
  onAddFunds,
}) => {
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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {charge?.voteType === VoteType.PerVote ? (
                <>
                  <MyVotes amountOfVotes={amountOfVotes} charge={charge} chainId={chainId} onAddFunds={onAddFunds} />
                  {charge ? <ChargeInfo charge={charge} /> : null}
                </>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div
              className={`relative flex w-full md:w-80 h-16 items-center px-8 text-[16px] bg-transparent font-bold ${
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
            <div className="flex flex-col gap-4">
              <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
              {charge?.voteType === VoteType.PerTransaction ? (
                <>
                  <MyVotes amountOfVotes={amountOfVotes} charge={charge} chainId={chainId} />
                  {charge ? <ChargeInfo charge={charge} /> : null}
                </>
              ) : null}
              {charge ? <TotalCharge charge={charge} amountOfVotes={amount} /> : null}
            </div>
          </div>

          <ButtonV3
            type={ButtonType.TX_ACTION}
            isDisabled={voteDisabled}
            colorClass="px-[20px] bg-gradient-purple rounded-[40px] w-full"
            size={ButtonSize.FULL}
            onClick={handleVote}
          >
            <span className="w-full text-center">add votes to entry</span>
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default VotingWidgetMobile;
