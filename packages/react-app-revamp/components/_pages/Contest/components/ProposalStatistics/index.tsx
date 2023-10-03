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
            {listProposalsIds.length} submission{listProposalsIds.length > 1 ? "s" : ""} &#8226;{" "}
            {contestMaxProposalCount.toString()} allowed
          </p>
        );
      case ContestStatus.VotingOpen:
      case ContestStatus.VotingClosed:
        return (
          <p className="text-[16px] text-neutral-11">
            {listProposalsIds.length} submission{listProposalsIds.length > 1 ? "s" : ""} &#8226;{" "}
            {formatNumber(totalVotesCast)} out of {formatNumber(totalVotes)} votes deployed in contest
          </p>
        );
    }
  }, [contestStatus, listProposalsIds.length, contestMaxProposalCount, totalVotesCast, totalVotes]);

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">submissions</p>
      {content}
    </div>
  );
};

export default ProposalStatistics;
