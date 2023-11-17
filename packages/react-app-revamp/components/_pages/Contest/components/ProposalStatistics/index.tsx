import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { FC, ReactNode, useMemo } from "react";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus }) => {
  const { contestMaxProposalCount, totalVotes, totalVotesCast } = useContestStore(state => state);
  const { submissionsCount, sortBy } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();

  const content = useMemo<ReactNode>(() => {
    switch (contestStatus) {
      case ContestStatus.SubmissionOpen:
        return (
          <p className="text-[16px] text-neutral-11">
            {submissionsCount} submission
            {submissionsCount > 1 || submissionsCount === 0 ? "s" : ""} &#8226; {contestMaxProposalCount.toString()}{" "}
            allowed
          </p>
        );
      case ContestStatus.VotingOpen:
      case ContestStatus.VotingClosed:
        return (
          <p className="text-[16px] text-neutral-11">
            {submissionsCount} submission{submissionsCount > 1 ? "s" : ""} &#8226; {formatNumber(totalVotesCast)} out of{" "}
            {formatNumber(totalVotes)} votes deployed in contest
          </p>
        );
    }
  }, [contestStatus, submissionsCount, contestMaxProposalCount, totalVotesCast, totalVotes]);

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">submissions</p>
      <div className="flex justify-between items-center">
        {content}
        <div className="text-[16px] text-positive-11" onClick={() => sortProposalData("mostRecent")}>
          sort: {sortBy}
        </div>
      </div>
    </div>
  );
};

export default ProposalStatistics;
