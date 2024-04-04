import ChargeLayout from "@components/ChargeLayout";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { useFetchUserVotesOnProposal } from "@hooks/useFetchUserVotesOnProposal";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useAccount, useBalance } from "wagmi";

interface VotingWidgetProps {
  proposalId: string;
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ proposalId, amountOfVotes, downvoteAllowed, onVote }) => {
  const { charge } = useContestStore(state => state);
  const asPath = usePathname();
  const { address, chainId: accountChainId } = useAccount();
  const { data: accountData } = useBalance({
    address: address as `0x${string}`,
  });
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const { isLoading } = useCastVotesStore(state => state);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const voteDisabled = isLoading || amount === 0 || isInvalid || isNaN(amount);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const isCorrectNetwork = chainId === accountChainId;
  const showVoteCharge = charge && charge.type.costToVote && accountData && isCorrectNetwork;
  const { currentUserVotesOnProposal } = useFetchUserVotesOnProposal(contestAddress, proposalId);

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

  return (
    <div className="flex flex-col gap-6 md:w-60">
      <hr className="border border-neutral-9" />
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
        <div
          className={`flex h-8 justify-between items-center pl-6 pr-4 text-[16px] bg-transparent font-bold ${
            isInvalid ? "text-negative-11" : "text-neutral-11"
          } border ${isFocused && !isInvalid ? "border-neutral-11" : isInvalid ? "border-negative-11" : "border-neutral-10"} rounded-[40px] transition-colors duration-300`}
        >
          <span>Amount</span>
          <div className="flex items-center">
            <input
              type="number"
              value={amount}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="0 votes"
              max={amountOfVotes}
              onKeyDown={handleKeyDownInput}
              onInput={handleInput}
              className="text-right w-24 bg-transparent outline-none mr-1 placeholder-neutral-10"
            />
            {amount > 0 && <span>vote{amount !== 1 ? "s" : ""}</span>}
          </div>
        </div>
        <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
        <div className="flex flex-col gap-1 text-[16px]">
          <div className="flex justify-between text-neutral-11 transition-colors duration-300 hover:text-positive-11 ">
            <p>votes on submission</p>
            <p className="font-bold">{formatNumber(currentUserVotesOnProposal.data ?? 0)}</p>
          </div>
          <div className="flex justify-between text-neutral-11  hover:text-positive-11 transition-colors duration-300">
            <p>my remaining votes</p>
            <p className="font-bold">{formatNumber(amountOfVotes)}</p>
          </div>
        </div>
      </div>

      <hr className="border border-neutral-9" />

      {showVoteCharge ? (
        <ChargeLayout accountData={accountData} charge={charge} type="vote" amountOfVotes={amount} />
      ) : null}

      <div className="mt-2 flex flex-col gap-8">
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
    </div>
  );
};

export default VotingWidget;
