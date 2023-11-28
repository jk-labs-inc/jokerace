/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import StepSlider from "@components/UI/Slider";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { switchNetwork } from "@wagmi/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount, useNetwork } from "wagmi";

interface VotingWidgetProps {
  amountOfVotes: number;
  downvoteAllowed?: boolean;
  onVote?: (amount: number, isUpvote: boolean) => void;
}

const VotingWidget: FC<VotingWidgetProps> = ({ amountOfVotes, downvoteAllowed, onVote }) => {
  const { address } = useAccount();
  const { getUserVotesOnProposal } = useUser();
  const {
    currentUserTotalVotesAmount,
    currentUserVotesOnProposal,
    isCurrentUserVotesOnProposalLoading,
    isCurrentUserVotesOnProposalError,
  } = useUserStore(state => state);
  const { asPath } = useRouter();
  const { chainName } = extractPathSegments(asPath);
  const { chain } = useNetwork();
  const { isLoading, pickedProposal } = useCastVotesStore(state => state);
  const [isUpvote, setIsUpvote] = useState(true);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const voteDisabled = isLoading || amount === 0 || isInvalid;
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const isCorrectNetwork = chainId === chain?.id;

  useEffect(() => {
    if (!address || !pickedProposal) return;

    const fetchUserVotes = async () => {
      await getUserVotesOnProposal(address, pickedProposal);
    };

    fetchUserVotes();
  }, [pickedProposal, address]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (!isCorrectNetwork) {
          onSwitchNetwork();
          return;
        }
        onVote?.(amount, isUpvote);
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [amount, isUpvote, onVote]);

  const handleClick = (value: boolean) => {
    setIsUpvote(value);
  };

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
    const newAmount = ((value / 100) * amountOfVotes).toFixed(4);

    setAmount(parseFloat(newAmount));
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

  const onSwitchNetwork = async () => {
    await switchNetwork({ chainId });
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
          <div
            className={`flex ${
              isCurrentUserVotesOnProposalError ? "flex-col" : "flex-row"
            } justify-between text-[16px]`}
          >
            <p className="text-neutral-11">my votes on submission</p>
            {isCurrentUserVotesOnProposalLoading ? (
              <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />
            ) : isCurrentUserVotesOnProposalError ? (
              <p className="text-negative-11 font-bold">ruh roh! we couldn't load your votes on this proposal!</p>
            ) : (
              <p className="text-positive-11 font-bold">{formatNumber(currentUserVotesOnProposal)}</p>
            )}
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="text-neutral-11">my remaining votes</p>
            <p className="text-positive-11 font-bold">
              {formatNumber(amountOfVotes)}/{formatNumber(currentUserTotalVotesAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingWidget;
