import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { VotingButtonText } from "@components/Voting";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { GetBalanceData } from "wagmi/query";

interface VotingWidgetMobileProps {
  isUpvote: boolean;
  isInvalid: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  amount: number;
  amountOfVotes: number;
  isFocused: boolean;
  sliderValue: number;
  charge: Charge | null;
  chainId: number;
  voteDisabled: boolean;
  insufficientBalance: boolean;
  balanceData: GetBalanceData | undefined;
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
  isUpvote,
  isInvalid,
  inputRef,
  amount,
  amountOfVotes,
  isFocused,
  insufficientBalance,
  balanceData,
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
  const [buttonText, setButtonText] = useState(VotingButtonText.ADD_VOTES);

  useEffect(() => {
    if (insufficientBalance) {
      setButtonText(VotingButtonText.ADD_FUNDS);
    } else {
      setButtonText(VotingButtonText.ADD_VOTES);
    }
  }, [insufficientBalance]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {charge?.voteType === VoteType.PerVote ? (
                <>
                  <MyVotes
                    balanceData={balanceData}
                    amountOfVotes={amountOfVotes}
                    charge={charge}
                    onAddFunds={onAddFunds}
                  />
                  {charge ? <ChargeInfo charge={charge} /> : null}
                </>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div
              className={`relative flex w-full md:w-80 h-16 items-center px-8 text-[16px] bg-transparent font-bold ${
                isInvalid ? "text-negative-11" : "text-neutral-11"
              } border-2 ${
                isFocused && !isInvalid ? "border-neutral-11" : isInvalid ? "border-negative-11" : "border-neutral-10"
              } rounded-[40px] transition-colors duration-300`}
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
                  <MyVotes balanceData={balanceData} amountOfVotes={amountOfVotes} charge={charge} />
                  {charge ? <ChargeInfo charge={charge} /> : null}
                </>
              ) : null}
              {charge ? <TotalCharge charge={charge} amountOfVotes={amount} /> : null}
            </div>
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

export default VotingWidgetMobile;
