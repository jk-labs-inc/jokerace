import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { SortOptions, useProposalStore } from "@hooks/useProposal/store";
import { FC, useMemo } from "react";
import ProposalStatisticsPanel from "./components/Panel";
import SortProposalsDropdown from "./components/SortDropdown";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
  onMenuStateChange: (isOpen: boolean) => void;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus, onMenuStateChange }) => {
  const { sortBy, submissionsCount } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();
  const isSubmissionOrVotingOpen =
    contestStatus === ContestStatus.SubmissionOpen || contestStatus === ContestStatus.VotingOpen;

  const handleSortTypeChange = (value: string) => {
    sortProposalData(value as SortOptions);
  };

  const contestStatusTitle = useMemo<string>(() => {
    switch (contestStatus) {
      case ContestStatus.ContestOpen:
        return "Submissions Not Yet Open";
      case ContestStatus.SubmissionOpen:
        return "Submissions Open";
      case ContestStatus.VotingOpen:
        return "Voting Open";
      case ContestStatus.VotingClosed:
        return "Voting Closed";
      default:
        return "";
    }
  }, [contestStatus]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        {isSubmissionOrVotingOpen ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-10 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-positive-11"></span>
          </span>
        ) : null}
        <p className="text-[24px] text-neutral-11 font-bold normal-case">{contestStatusTitle}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center border-b border-primary-2 pb-4">
        <ProposalStatisticsPanel submissionsCount={submissionsCount} contestStatus={contestStatus} />
        {submissionsCount > 1 ? (
          <SortProposalsDropdown
            defaultValue={sortBy ?? ""}
            onChange={handleSortTypeChange}
            onMenuStateChange={onMenuStateChange}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProposalStatistics;
