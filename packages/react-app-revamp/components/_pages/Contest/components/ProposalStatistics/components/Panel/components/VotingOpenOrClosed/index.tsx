import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useRouter } from "next/router";
import { FC } from "react";
import ProposalStatisticsTotalVotes from "./components/TotalVotes";
import ProposalStatisticsTotalVotesCast from "./components/TotalVotesCast";
interface ProposalStatisticsPanelVotingOpenOrClosedProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelVotingOpenOrClosed: FC<ProposalStatisticsPanelVotingOpenOrClosedProps> = ({
  submissionsCount,
}) => {
  const asPath = useRouter().asPath;
  const { address, chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;

  return (
    <div className="flex flex-col md:flex-row gap-1 md:items-center">
      <p className="text-[16px] text-neutral-11">
        {submissionsCount} submission{submissionsCount !== 1 ? "s" : ""}
      </p>
      <span className="hidden md:block">&#8226;</span>
      <div className="flex gap-1 items-center text-[16px] text-neutral-11">
        <ProposalStatisticsTotalVotesCast address={address} chainId={chainId} />
        <ProposalStatisticsTotalVotes address={address} chainId={chainId} /> votes deployed in contest
      </div>
    </div>
  );
};

export default ProposalStatisticsPanelVotingOpenOrClosed;
