/* eslint-disable react/no-unescaped-entities */
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import CrossIcon from "@components/UI/Icons/Cross";
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ReactNode } from "react-markdown/lib/ast-to-react";
import { useWindowScroll } from "react-use";
import { useAccount } from "wagmi";

const LayoutContestQualifier = () => {
  const { isConnected } = useAccount();
  const {
    currentUserQualifiedToSubmit,
    currentUserAvailableVotesAmount,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
  } = useUserStore(state => state);
  const { y } = useWindowScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsScrolled(y > 500);
  }, [y]);

  const qualifiedToSubmitMessage = useMemo<ReactNode>(() => {
    if (currentUserProposalCount >= contestMaxNumberSubmissionsPerUser || !currentUserQualifiedToSubmit) {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          <CrossIcon />
          <p>you don't qualify to submit</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          <div className="mt-1">
            <CheckmarkIcon />
          </div>
          <p>you qualify to submit</p>
        </div>
      );
    }
  }, [currentUserQualifiedToSubmit, currentUserProposalCount, contestMaxNumberSubmissionsPerUser]);

  const qualifiedToVoteMessage = useMemo<ReactNode>(() => {
    if (currentUserAvailableVotesAmount > 0) {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          {!isScrolled && (
            <div className="mt-1">
              <CheckmarkIcon />
            </div>
          )}

          <p>
            you have <span className="font-bold">{formatNumber(currentUserAvailableVotesAmount)} votes</span>
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-nowrap items-center gap-1">
        <CrossIcon />
        <p>you don't qualify to vote</p>
      </div>
    );
  }, [currentUserAvailableVotesAmount, isScrolled]);

  return (
    <div className="w-full bg-true-black flex flex-col gap-1 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
      <Image src="/contest/ballot.svg" width={33} height={33} alt="timer" />

      {isConnected ? (
        <div className="flex flex-col">
          {isScrolled ? (
            <div className="text-[20px]  text-neutral-11">{qualifiedToVoteMessage}</div>
          ) : (
            <>
              <div className="text-[16px] text-neutral-11">{qualifiedToSubmitMessage}</div>
              <div className="text-[16px]  text-neutral-11">{qualifiedToVoteMessage}</div>
            </>
          )}
        </div>
      ) : (
        <div className="text-[16px] font-bold text-neutral-11 mt-2">connect a wallet to see if you qualify</div>
      )}
    </div>
  );
};

export default LayoutContestQualifier;
