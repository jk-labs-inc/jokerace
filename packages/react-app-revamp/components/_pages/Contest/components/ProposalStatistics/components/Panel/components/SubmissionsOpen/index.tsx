import { formatNumberWithCommas } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { FC } from "react";
import { useShallow } from "zustand/shallow";

interface ProposalStatisticsPanelSubmissionOpenProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelSubmissionOpen: FC<ProposalStatisticsPanelSubmissionOpenProps> = ({
  submissionsCount,
}) => {
  const contestMaxProposalCount = useContestStore(useShallow(state => state.contestMaxProposalCount));

  return (
    <p className="text-[12px] md:text-[16px] text-neutral-9 font-bold">
      {formatNumberWithCommas(submissionsCount)} / {formatNumberWithCommas(contestMaxProposalCount)}{" "}
      {submissionsCount !== 1 ? "entries" : "entry"} submitted
    </p>
  );
};

export default ProposalStatisticsPanelSubmissionOpen;
