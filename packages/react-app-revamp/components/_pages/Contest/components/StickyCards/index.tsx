import useContestEvents from "@hooks/useContestEvents";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const { displayReloadBanner } = useContestEvents();

  if (contestStatus === ContestStatus.VotingClosed) return null;

  if (isContestCanceled)
    return (
      <div className="mt-8">
        <hr className="border-primary-2 border" />
      </div>
    );

  return (
    <div
      className={`flex flex-col bg-true-black sticky ${displayReloadBanner ? "top-[105px]" : "-top-[1px]"} z-10 mt-8`}
    >
      <div className="flex gap-4 py-4">
        <ContestCountdown />
        <VotingContestQualifier />
      </div>
      <hr className="border-primary-2 border" />
    </div>
  );
};

export default ContestStickyCards;
