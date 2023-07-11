import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";
import LayoutContestCountdown from "./components/Countdown";
import LayoutContestQualifier from "./components/Qualifier";

interface ContestLayoutStickyCardsProps {
  contestStatus: ContestStatus;
  submissionsOpen: Date;
  votesOpen: Date;
  votesClose: Date;
  displayReloadBanner: boolean;
}

const ContestLayoutStickyCards: FC<ContestLayoutStickyCardsProps> = ({
  contestStatus,
  submissionsOpen,
  votesClose,
  votesOpen,
  displayReloadBanner,
}) => {
  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div
      className={`mt-8 flex flex-col md:flex-row gap-4 sticky ${
        displayReloadBanner ? "top-[105px]" : "top-0"
      } z-10 bg-true-black`}
    >
      <LayoutContestCountdown submissionOpen={submissionsOpen} votingOpen={votesOpen} votingClose={votesClose} />
      <LayoutContestQualifier />
    </div>
  );
};

export default ContestLayoutStickyCards;
