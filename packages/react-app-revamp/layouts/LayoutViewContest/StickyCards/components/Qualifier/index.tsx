/* eslint-disable react/no-unescaped-entities */
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";

const LayoutContestQualifier = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { currentUserQualifiedToSubmit, currentUserAvailableVotesAmount, currentUserTotalVotesAmount, isLoading } =
    useUserStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const isReadOnly = useContestStore(state => state.isReadOnly);

  const qualifiedMessage = useMemo(() => {
    const canSubmit = currentUserQualifiedToSubmit;
    const canVote = currentUserAvailableVotesAmount > 0;

    if (isReadOnly) {
      if (canSubmit) {
        return "you qualify to submit ( vote is in read mode )";
      } else {
        return "vote and submit is in read mode";
      }
    }

    if (contestStatus === ContestStatus.VotingOpen) {
      if (canVote) {
        return (
          <p>
            you have <span className="font-bold">{formatNumber(currentUserAvailableVotesAmount)} votes</span>
          </p>
        );
      } else if (currentUserTotalVotesAmount > 0) {
        return "you're out of votes :(";
      }
      return "you don't qualify to vote";
    }

    if (canSubmit && canVote) {
      return "you qualify to submit & vote";
    } else if (canSubmit && !canVote) {
      return "you qualify to submit ( but not vote )";
    } else if (!canSubmit && canVote) {
      return "you qualify to vote ( but not submit )";
    } else {
      return "you don't qualify to submit & vote";
    }
  }, [
    currentUserQualifiedToSubmit,
    currentUserAvailableVotesAmount,
    isReadOnly,
    contestStatus,
    currentUserTotalVotesAmount,
  ]);

  if (!isConnected) {
    return (
      <div className="w-full h-12 bg-neutral-0 flex gap-2 border border-transparent rounded-[10px] p-4 items-center">
        <div className="text-[16px] text-neutral-11">
          <span className="text-positive-11 cursor-pointer font-bold" onClick={openConnectModal}>
            connect wallet
          </span>{" "}
          to see if you qualify
        </div>
      </div>
    );
  }

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <div className="w-full h-12 bg-neutral-0 flex gap-3 border border-transparent rounded-[10px] p-4 items-center">
        <Image src="/contest/ballot.svg" width={24} height={24} alt="ballot" />

        {isLoading ? (
          <Skeleton height={16} width={200} />
        ) : (
          <div className="flex flex-col">
            <div className="text-[16px]  text-neutral-11">{qualifiedMessage}</div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default LayoutContestQualifier;
