import { useContestStore } from "@hooks/useContest/store";
import { FC } from "react";

interface ProposalStatisticsPanelSubmissionOpenProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelSubmissionOpen: FC<ProposalStatisticsPanelSubmissionOpenProps> = ({
  submissionsCount,
}) => {
  const contestMaxProposalCount = useContestStore(state => state.contestMaxProposalCount);

  return (
    <p className="text-[16px] text-neutral-11">
      {submissionsCount} submission
      {submissionsCount > 1 || submissionsCount === 0 ? "s" : ""} &#8226; {contestMaxProposalCount.toString()} allowed
    </p>
  );
};

export default ProposalStatisticsPanelSubmissionOpen;
