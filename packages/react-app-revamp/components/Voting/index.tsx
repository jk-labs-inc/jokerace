import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import { switchChain } from "@wagmi/core";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useAccount } from "wagmi";

interface VotingWidgetProps {
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ amountOfVotes, downvoteAllowed, onVote }) => {
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { asPath } = useRouter();
  const { chainName } = extractPathSegments(asPath);
  const { chainId: accountChainId } = useAccount();
  const { isLoading } = useCastVotesStore(state => state);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const voteDisabled = isLoading || amount === 0 || isInvalid || isNaN(amount);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const isCorrectNetwork = chainId === accountChainId;

  const handleClick = (value: boolean) => {
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
    const newAmount = ((value / 100) * amountOfVotes).toFixed(4);
    setAmount(parseFloat(newAmount));
  };

  const handleChange = (value: string) => {
    const numericInput = parseFloat(value);

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
      setSliderValue((numericInput / amountOfVotes) * 100);
    }
  };

  const handleKeyDownSlider = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleVote();
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col gap-7 w-full md:w-60">
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
              value={amount}
              onChange={e => handleChange(e.target.value)}
              placeholder="0.00 votes"
              max={amountOfVotes}
              onKeyDown={handleKeyDownInput}
              className="text-right w-24 bg-transparent outline-none mr-1 placeholder-neutral-10"
            />
            {amount > 0 && <span>vote{amount !== 1 ? "s" : ""}</span>}
          </div>
        </div>
        <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
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

        <div className="mt-4">
          {isCorrectNetwork ? (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              isDisabled={voteDisabled}
              colorClass="flex items-center px-[20px] justify-between bg-gradient-next rounded-[40px] w-full"
              size={ButtonSize.LARGE}
              onClick={() => onVote?.(amount, isUpvote)}
            >
              <span className="w-full text-center">add votes</span>
              <ChevronRightIcon className="w-5" />
            </ButtonV3>
          ) : (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              colorClass="flex items-center justify-center bg-gradient-vote rounded-[40px] w-full"
              size={ButtonSize.LARGE}
              onClick={onSwitchNetwork}
            >
              switch network
            </ButtonV3>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex justify-between text-[16px]">
            <p className="text-neutral-11">my remaining votes</p>
            <p className="font-bold">
              <span className="text-positive-11">{formatNumber(amountOfVotes)}</span>/
              <span className="text-neutral-11">{formatNumber(currentUserTotalVotesAmount)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
