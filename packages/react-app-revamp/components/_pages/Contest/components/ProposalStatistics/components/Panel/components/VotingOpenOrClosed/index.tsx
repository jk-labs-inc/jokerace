import { formatNumberWithCommas } from "@helpers/formatNumber";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { compareVersions } from "compare-versions";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import ProposalStatisticsTotalVotesCast from "./components/TotalVotesCast";

interface ProposalStatisticsPanelVotingOpenOrClosedProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelVotingOpenOrClosed: FC<ProposalStatisticsPanelVotingOpenOrClosedProps> = ({
  submissionsCount,
}) => {
  const { version, address, chainId } = useContestConfigStore(useShallow(state => state.contestConfig));
  const isV3OrHigher = compareVersions(version, "3.0") >= 0;

  return (
    <div className="flex gap-1 items-center">
      <p className="text-[12px] md:text-[16px] text-neutral-9 font-bold">
        {formatNumberWithCommas(submissionsCount)} {submissionsCount !== 1 ? "entries" : "entry"}
      </p>
      {isV3OrHigher && (
        <>
          <span className=" text-neutral-9">&#8226;</span>
          <div className="flex gap-1 items-center text-[12px] md:text-[16px] text-neutral-9 font-bold">
            <ProposalStatisticsTotalVotesCast address={address} chainId={chainId} /> votes
          </div>
        </>
      )}
    </div>
  );
};

export default ProposalStatisticsPanelVotingOpenOrClosed;
