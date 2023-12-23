import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { SortOptions, useProposalStore } from "@hooks/useProposal/store";
import { FC } from "react";
import ProposalStatisticsPanel from "./components/Panel";
import SortProposalsDropdown from "./components/SortDropdown";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
  onMenuStateChange: (isOpen: boolean) => void;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus, onMenuStateChange }) => {
  const { sortBy, submissionsCount } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();

  const handleSortTypeChange = (value: string) => {
    sortProposalData(value as SortOptions);
  };

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">submissions</p>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
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
