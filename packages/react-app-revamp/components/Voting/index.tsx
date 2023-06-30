import ButtonV3 from "@components/UI/ButtonV3";
import TooltipSlider from "@components/UI/Slider";
import StepSlider from "@components/UI/Slider";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { FC, useState } from "react";
import { useMedia } from "react-use";

interface VotingWidgetProps {
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: string, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ amountOfVotes, downvoteAllowed, onVote }) => {
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleClick = (value: boolean) => {
    if (!downvoteAllowed) {
      return;
    }
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
    setAmount(((value / 100) * amountOfVotes).toFixed(0));
  };
  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue)) {
      setAmount(inputValue);
      if (inputValue === "0") {
        setAmount("");
      } else {
        const numericInput = Number(inputValue);
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
              value={amount ? `${amount}` : ""}
              onChange={handleChange}
              placeholder="0.00 votes"
              max={amountOfVotes}
              className="text-right w-24 bg-transparent outline-none mr-1 placeholder-neutral-10"
            />
            {amount && <span>votes</span>}
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
            color="flex items-center px-[20px] justify-between bg-gradient-vote rounded-[40px] w-full"
            size="large"
            onClick={() => onVote?.(amount, isUpvote)}
          >
            <span className="w-full text-center">add votes</span>
            <ChevronRightIcon className="w-5" />
          </ButtonV3>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default VotingWidget;
