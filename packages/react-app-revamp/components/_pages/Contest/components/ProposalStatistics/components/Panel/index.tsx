import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { FC } from "react";
import ProposalStatisticsPanelSubmissionOpen from "./components/SubmissionsOpen";
import ProposalStatisticsPanelVotingOpenOrClosed from "./components/VotingOpenOrClosed";

interface ProposalStatisticsPanelProps {
  contestStatus: ContestStatus;
}

const ProposalStatisticsPanel: FC<ProposalStatisticsPanelProps> = ({ contestStatus }) => {
  const submissionsCount = useProposalStore(state => state.submissionsCount);

  if (contestStatus === ContestStatus.SubmissionOpen) {
    return <ProposalStatisticsPanelSubmissionOpen submissionsCount={submissionsCount} />;
  }

  if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) {
    return <ProposalStatisticsPanelVotingOpenOrClosed submissionsCount={submissionsCount} />;
  }

  return null;
};

export default ProposalStatisticsPanel;
