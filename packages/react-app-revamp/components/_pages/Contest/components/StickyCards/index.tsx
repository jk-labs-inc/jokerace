import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useContestStore } from "@hooks/useContest/store";
import { useCountdownTimer } from "@hooks/useTimer";
import { useShallow } from "zustand/shallow";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";
import PriceCurveWrapper from "../PriceCurveChart/PriceCurveWrapper";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const { contestState } = useContestStateStore(state => state);
  const { votesClose } = useContestStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const votingTimeLeft = useCountdownTimer(votesClose);

  if (isContestCanceled || contestStatus === ContestStatus.VotingClosed) {
    return (
      <div className="mt-8">
        <hr className="border-primary-2 border" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-true-black sticky -top-px z-10 mt-8">
      <div className="flex gap-4 py-4">
        <ContestCountdown votingTimeLeft={votingTimeLeft} />
        <VotingContestQualifier votingTimeLeft={votingTimeLeft} />
      </div>
      <PriceCurveWrapper contestAddress="0x123" chainId={1} />
      <hr className="border-primary-2 border" />
    </div>
  );
};

export default ContestStickyCards;
