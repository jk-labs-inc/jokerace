import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import ContestCountdown from "./components/Countdown";
import ContestQualifier from "./components/Qualifier";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { displayReloadBanner } = useContestEvents();

  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div
      className={`mt-8 flex flex-col md:flex-row gap-4 md:sticky ${
        displayReloadBanner ? "top-[105px]" : "top-0"
      } z-10 bg-true-black`}
    >
      <ContestCountdown />
      <ContestQualifier />
    </div>
  );
};

export default ContestStickyCards;
