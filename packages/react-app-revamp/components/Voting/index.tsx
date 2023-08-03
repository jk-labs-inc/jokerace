import ButtonV3 from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useEffect, useState } from "react";

interface VotingWidgetProps {
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ amountOfVotes, downvoteAllowed, onVote }) => {
  const isMerkleTreeInProgress = useContestStore(state => state.isMerkleTreeInProgress);
  const currentUserTotalVotesCast = useUserStore(state => state.currentUserTotalVotesCast);
  const isLoading = useCastVotesStore(state => state.isLoading);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const voteDisabled = isMerkleTreeInProgress || isLoading || amount === 0 || isInvalid;

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onVote?.(amount, isUpvote);
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [amount, isUpvote, onVote]);

  const handleClick = (value: boolean) => {
    if (!downvoteAllowed) {
      return;
    }
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
    const newAmount = (value / 100) * amountOfVotes;

    setAmount(newAmount);
  };

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue)) {
      setAmount(parseFloat(inputValue));
      if (inputValue === "0") {
        setAmount(0);
      } else {
        const numericInput = parseFloat(inputValue);
        setSliderValue((numericInput / amountOfVotes) * 100);
        setIsInvalid(numericInput > amountOfVotes);
      }
    }
  };

  return (
    <div className="flex flex-col gap-7 w-60">
      <div className="flex flex-col gap-4">
        <div
          className={`flex h-8 justify-between items-center pl-6 pr-4 text-[16px] bg-transparent font-bold ${
            isInvalid ? "text-negative-11" : "text-neutral-11"
          } border border-neutral-10 rounded-[40px]`}
        >
          <span>Amount</span>
          <div className="flex items-center">
            <input
              type="number"
              value={amount > 0 ? amount : ""}
              onChange={handleChange}
              placeholder="0.00 votes"
              max={amountOfVotes}
              className="text-right w-24 bg-transparent outline-none mr-1 placeholder-neutral-10"
            />
            {amount > 0 && <span>votes</span>}
          </div>
        </div>
        <div>
          <StepSlider val={sliderValue} onChange={handleSliderChange} />
        </div>
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
        <div className="mt-4">
          <ButtonV3
            type="txAction"
            disabled={voteDisabled}
            color="flex items-center px-[20px] justify-between bg-gradient-vote rounded-[40px] w-full"
            size="large"
            onClick={() => onVote?.(amount, isUpvote)}
          >
            <span className="w-full text-center">add votes</span>
            <ChevronRightIcon className="w-5" />
          </ButtonV3>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex justify-between text-[16px]">
            <p className="text-neutral-11">votes on submission</p>
            <p className="text-positive-11 font-bold">{formatNumber(currentUserTotalVotesCast)}</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="text-neutral-11">my remaining votes</p>
            <p className="text-positive-11 font-bold">{formatNumber(amountOfVotes)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
