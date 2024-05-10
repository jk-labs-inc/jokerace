import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";
import ProposalStatisticsPanelSubmissionOpen from "./components/SubmissionsOpen";
import ProposalStatisticsPanelVotingOpenOrClosed from "./components/VotingOpenOrClosed";

interface ProposalStatisticsPanelProps {
  submissionsCount: number;
  contestStatus: ContestStatus;
}

const ProposalStatisticsPanel: FC<ProposalStatisticsPanelProps> = ({ submissionsCount, contestStatus }) => {
  if (contestStatus === ContestStatus.SubmissionOpen) {
    return <ProposalStatisticsPanelSubmissionOpen submissionsCount={submissionsCount} />;
  }

  if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) {
    return <ProposalStatisticsPanelVotingOpenOrClosed submissionsCount={submissionsCount} />;
  }

  return null;
};

export default ProposalStatisticsPanel;
