import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import LayoutContestCountdown from "./components/Countdown";
import LayoutContestQualifier from "./components/Qualifier";

const ContestLayoutStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { displayReloadBanner } = useContestEvents();

  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div
      className={`mt-8 flex flex-col md:flex-row gap-4 sticky ${
        displayReloadBanner ? "top-[105px]" : "top-0"
      } z-10 bg-true-black`}
    >
      <LayoutContestCountdown />
      <LayoutContestQualifier />
    </div>
  );
};

export default ContestLayoutStickyCards;
