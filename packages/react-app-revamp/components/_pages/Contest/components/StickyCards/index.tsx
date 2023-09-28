import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { currentUserQualifiedToSubmit, isLoading } = useUserStore(state => state);
  const { displayReloadBanner } = useContestEvents();

  const qualifiedToSubmitMessage = useMemo(() => {
    if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) return null;
    if (isLoading)
      return <Skeleton height={16} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />;

    if (contestStatus === ContestStatus.ContestOpen && currentUserQualifiedToSubmit) {
      return (
        <p className="text-[16px] text-primary-10">
          good news: you qualify to submit a response once the contest opens!
        </p>
      );
    } else if (contestStatus === ContestStatus.SubmissionOpen) {
      if (!currentUserQualifiedToSubmit) {
        return (
          <p className="text-[16px] text-primary-10">
            unfortunately, your wallet wasn’t allowlisted to submit in this contest.
          </p>
        );
      } else {
        return null;
      }
    }

    return null;
  }, [contestStatus, currentUserQualifiedToSubmit, isLoading]);

  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div className="flex flex-col gap-8 mt-8">
      {qualifiedToSubmitMessage}
      <div
        className={`flex flex-col md:flex-row gap-4 md:sticky ${
          displayReloadBanner ? "top-[105px]" : "top-0"
        } z-10 bg-true-black`}
      >
        <ContestCountdown />
        <VotingContestQualifier />
      </div>
    </div>
  );
};

export default ContestStickyCards;
