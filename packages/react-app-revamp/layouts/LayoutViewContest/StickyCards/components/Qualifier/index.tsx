/* eslint-disable react/no-unescaped-entities */
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import CrossIcon from "@components/UI/Icons/Cross";
import { isSupabaseConfigured } from "@helpers/database";
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useWindowScroll } from "react-use";
import { useAccount } from "wagmi";

const LayoutContestQualifier = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { currentUserQualifiedToSubmit, currentUserAvailableVotesAmount, isLoading } = useUserStore(state => state);
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

    if (canSubmit && canVote) {
      return "you qualify to submit & vote";
    } else if (canSubmit && !canVote) {
      return "you qualify to submit ( but not vote )";
    } else if (!canSubmit && canVote) {
      return "you qualify to vote ( but not submit )";
    } else {
      return "you don't qualify to submit & vote";
    }
  }, [currentUserQualifiedToSubmit, currentUserAvailableVotesAmount, isReadOnly]);

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
