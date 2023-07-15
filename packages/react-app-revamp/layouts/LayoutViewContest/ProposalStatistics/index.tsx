import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { FC, ReactNode, useMemo } from "react";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus }) => {
  const { contestMaxProposalCount, totalVotes, totalVotesCast } = useContestStore(state => state);
  const { listProposalsIds } = useProposalStore(state => state);

  const content = useMemo<ReactNode>(() => {
    switch (contestStatus) {
      case ContestStatus.SubmissionOpen:
        return (
          <p className="text-[16px] text-neutral-11">
            {listProposalsIds.length}/{contestMaxProposalCount.toString()} submitted
          </p>
        );
      case ContestStatus.VotingOpen:
      case ContestStatus.VotingClosed:
        return (
          <p className="text-[16px] text-neutral-11">
            {totalVotesCast >= 0
              ? `${formatNumber(totalVotesCast)} votes deployed/${formatNumber(
                  totalVotes,
                )} available votes in the contest`
              : `${formatNumber(totalVotes)} available votes in the contest`}
          </p>
        );
      default:
        break;
    }
  }, [contestStatus, listProposalsIds, totalVotesCast, totalVotes]);

  const heading = useMemo<string>(() => {
    switch (contestStatus) {
      case ContestStatus.SubmissionOpen:
      case ContestStatus.VotingOpen:
        return "submissions";
      case ContestStatus.VotingClosed:
        return "votes";
      default:
        return "submissions";
    }
  }, [contestStatus]);

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">{heading}</p>
      {content}
    </div>
  );
};

export default ProposalStatistics;
