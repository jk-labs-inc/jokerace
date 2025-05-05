import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";
import { useShallow } from "zustand/shallow";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;

  if (isContestCanceled || contestStatus === ContestStatus.VotingClosed) {
    return (
      <div className="mt-8">
        <hr className="border-primary-2 border" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-true-black sticky -top-[1px] z-10 mt-8">
      <div className="flex gap-4 py-4">
        <ContestCountdown />
        <VotingContestQualifier />
      </div>
      <hr className="border-primary-2 border" />
    </div>
  );
};

export default ContestStickyCards;
