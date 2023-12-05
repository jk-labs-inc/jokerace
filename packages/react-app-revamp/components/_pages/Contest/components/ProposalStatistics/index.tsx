import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { SortOptions, useProposalStore } from "@hooks/useProposal/store";
import { FC } from "react";
import SortProposalsDropdown from "./components/SortDropdown";
import ProposalStatisticsPanel from "./components/Panel";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
  onMenuStateChange: (isOpen: boolean) => void;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus, onMenuStateChange }) => {
  const { sortBy } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();

  const handleSortTypeChange = (value: string) => {
    sortProposalData(value as SortOptions);
  };

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">submissions</p>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        <ProposalStatisticsPanel contestStatus={contestStatus} />
        <SortProposalsDropdown
          defaultValue={sortBy ?? ""}
          onChange={handleSortTypeChange}
          onMenuStateChange={onMenuStateChange}
        />
      </div>
    </div>
  );
};

export default ProposalStatistics;
