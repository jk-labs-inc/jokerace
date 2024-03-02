import ChargeLayout from "@components/ChargeLayout";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { switchChain } from "@wagmi/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

interface VotingWidgetProps {
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  proposalId: string;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ amountOfVotes, downvoteAllowed, proposalId, onVote }) => {
  const { charge } = useContestStore(state => state);
  const { currentUserTotalVotesAmount, currentUserVotesOnProposal } = useUserStore(state => state);
  const { updateCurrentUserVotesOnProposal } = useUser();
  const { asPath } = useRouter();
  const { address } = useAccount();
  const { data: accountData } = useBalance({
    address: address as `0x${string}`,
  });
  const { chainName } = extractPathSegments(asPath);
  const { chainId: accountChainId } = useAccount();
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

  useEffect(() => {
    if (!proposalId) return;

    //TOOD: do this cleaner
    updateCurrentUserVotesOnProposal(proposalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId]);

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
    <div className="flex flex-col gap-6 md:w-60">
      <hr className="border border-neutral-9 hover:border-positive-11 transition-colors duration-300" />
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
              placeholder="0.00 votes"
              max={amountOfVotes}
              onKeyDown={handleKeyDownInput}
              className="text-right w-24 bg-transparent outline-none mr-1 placeholder-neutral-10"
            />
            {amount > 0 && <span>vote{amount !== 1 ? "s" : ""}</span>}
          </div>
        </div>
        <StepSlider val={sliderValue} onChange={handleSliderChange} onKeyDown={handleKeyDownSlider} />
        <div className="flex flex-col gap-1 text-[16px] text-neutral-11 transition-colors duration-300">
          <div className="flex justify-between hover:text-positive-11 ">
            <p>votes on submission</p>
            <p className="font-bold">{formatNumber(currentUserVotesOnProposal)}</p>
          </div>
          <div className="flex justify-between hover:text-positive-11 transition-colors duration-300">
            <p>my remaining votes</p>
            <p className="font-bold">{formatNumber(amountOfVotes)}</p>
          </div>
        </div>
      </div>

      <hr className="border border-neutral-9 hover:border-positive-11 transition-colors duration-300" />

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
