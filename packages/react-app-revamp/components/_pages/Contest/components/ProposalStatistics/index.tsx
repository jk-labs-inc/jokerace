import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { SortOptions, useProposalStore } from "@hooks/useProposal/store";
import { usePathname } from "next/navigation";
import { FC } from "react";
import ProposalStatisticsPanel from "./components/Panel";
import SortProposalsDropdown from "./components/SortDropdown";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus }) => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0]?.id;
  const { sortBy, submissionsCount } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();
  const { contestAbi: abi, version } = useContestStore(state => state);

  const handleSortTypeChange = (value: string) => {
    sortProposalData({ address: address as `0x${string}`, abi, chainId }, version, value as SortOptions);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 items-center">
        <ProposalStatisticsPanel submissionsCount={submissionsCount} contestStatus={contestStatus} />
        {submissionsCount > 1 ? (
          <>
            <div className="text-primary-2 font-bold">|</div>
            <SortProposalsDropdown defaultValue={sortBy ?? ""} onChange={handleSortTypeChange} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProposalStatistics;
