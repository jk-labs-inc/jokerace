import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { FC } from "react";
import ProposalStatisticsTotalVotesCast from "./components/TotalVotesCast";
import { formatNumberWithCommas } from "@helpers/formatNumber";
import { useShallow } from "zustand/shallow";
import useContestConfigStore from "@hooks/useContestConfig/store";

interface ProposalStatisticsPanelVotingOpenOrClosedProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelVotingOpenOrClosed: FC<ProposalStatisticsPanelVotingOpenOrClosedProps> = ({
  submissionsCount,
}) => {
  const asPath = usePathname();
  const version = useContestConfigStore(useShallow(state => state.contestConfig.version));
  const { address, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
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
