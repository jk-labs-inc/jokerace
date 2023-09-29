/* eslint-disable react/no-unescaped-entities */
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";

const VotingContestQualifier = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount, isLoading } = useUserStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const isReadOnly = useContestStore(state => state.isReadOnly);

  const qualifiedMessage = useMemo(() => {
    const canVote = currentUserAvailableVotesAmount > 0;
    const votingOpen = contestStatus === ContestStatus.VotingOpen;
    const outOfVotes = currentUserTotalVotesAmount > 0 && !canVote;

    if (isReadOnly) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">vote is in read mode</p>;

    if (canVote && votingOpen) {
      return (
        <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
          {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount > 0 ? "s" : ""}
        </p>
      );
    }

    if (canVote) {
      return (
        <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">
          {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount > 0 ? "s" : ""} to deploy
        </p>
      );
    }

    if (outOfVotes)
      return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">you're out of votes :(</p>;

    return <p className="text-[16px] md:text-[24px] text-primary-10 font-bold">ineligible to vote</p>;
  }, [currentUserAvailableVotesAmount, isReadOnly, contestStatus, currentUserTotalVotesAmount]);

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4  md:pl-8">
      <div className="flex items-center gap-2">
        <Image src="/contest/ballot.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">your votes</p>
      </div>
      {isConnected ? (
        isLoading ? (
          <Skeleton height={24} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />
        ) : (
          qualifiedMessage
        )
      ) : (
        <p className="text-[24px] text-positive-11 font-bold cursor-pointer" onClick={openConnectModal}>
          connect wallet to see votes
        </p>
      )}
    </div>
  );
};

export default VotingContestQualifier;
