import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";
import useContestEvents from "@hooks/useContestEvents";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { displayReloadBanner } = useContestEvents();

  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div className={`flex gap-4 bg-true-black sticky ${displayReloadBanner ? "top-[105px]" : "top-0"} z-10 mt-8`}>
      <ContestCountdown />
      <VotingContestQualifier />
    </div>
  );
};

export default ContestStickyCards;
