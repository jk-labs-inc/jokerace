/* eslint-disable react/no-unescaped-entities */
import { useContestStore } from "@hooks/useContest/store";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import VotingQualifierMessage from "./components/VotingQualifierMessage";

const VotingContestQualifier = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    isCurrentUserVoteQualificationLoading,
    isCurrentUserVoteQualificationError,
  } = useUserStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const isReadOnly = useContestStore(state => state.isReadOnly);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4  md:pl-8">
      <div className="flex items-center gap-2">
        <Image src="/contest/ballot.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">my votes</p>
      </div>
      {isConnected ? (
        isCurrentUserVoteQualificationLoading ? (
          <Skeleton
            height={isMobile ? 16 : 24}
            width={isMobile ? 100 : 200}
            baseColor="#706f78"
            highlightColor="#FFE25B"
            duration={1}
          />
        ) : isCurrentUserVoteQualificationError ? (
          <p className="text-[16px] md:text-[24px] text-negative-11 font-bold">
            ruh roh, we couldn't load your votes! please reload the page
          </p>
        ) : (
          <VotingQualifierMessage
            currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
            currentUserTotalVotesAmount={currentUserTotalVotesAmount}
            contestStatus={contestStatus}
            isMobile={isMobile}
            isReadOnly={isReadOnly}
          />
        )
      ) : (
        <p className="text-[16px] md:text-[24px] text-positive-11 font-bold cursor-pointer" onClick={openConnectModal}>
          {isMobile ? "connect wallet to see" : "connect wallet to see votes"}
        </p>
      )}
    </div>
  );
};

export default VotingContestQualifier;
