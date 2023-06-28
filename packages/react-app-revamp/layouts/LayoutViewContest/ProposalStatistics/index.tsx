import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { FC, ReactNode, useMemo } from "react";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus }) => {
  const { contestMaxProposalCount } = useContestStore(state => state);
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
            {/* {listProposalsIds.length}/{contestMaxProposalCount.toString()} submitted */}
          </p>
        );
      default:
        break;
    }
  }, [contestStatus, listProposalsIds]);

  const heading = useMemo<string>(() => {
    switch (contestStatus) {
      case ContestStatus.SubmissionOpen:
        return "submissions";
      case ContestStatus.VotingOpen:
      case ContestStatus.VotingClosed:
        return "votes";
      default:
        return "submissions";
    }
  }, [contestStatus]);

  return (
    <div className="flex flex-col gap-4 border-t border-neutral-10">
      <p className="text-[24px] text-neutral-11 font-bold mt-4">{heading}</p>
      {content}
    </div>
  );
};

export default ProposalStatistics;
