import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";

interface ProposalStatisticsPanelSubmissionOpenProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelSubmissionOpen: FC<ProposalStatisticsPanelSubmissionOpenProps> = ({
  submissionsCount,
}) => {
  const contestMaxProposalCount = useContestStore(state => state.contestMaxProposalCount);

  return (
    <p className="text-[12px] md:text-[16px] text-neutral-9 font-bold">
      {submissionsCount} / {formatNumberAbbreviated(contestMaxProposalCount)}{" "}
      {submissionsCount !== 1 ? "entries" : "entry"} submitted
    </p>
  );
};

export default ProposalStatisticsPanelSubmissionOpen;
