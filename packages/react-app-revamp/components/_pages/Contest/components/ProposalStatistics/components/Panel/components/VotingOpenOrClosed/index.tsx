/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import useTotalVotesOnContest from "@hooks/useTotalVotes";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { useRouter } from "next/router";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
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
  const { totalVotes, refetchTotalVotes, isTotalVotesLoading, isTotalVotesError, isTotalVotesSuccess } =
    useTotalVotesOnContest(address, chainId);
  const { totalVotesCast, retry: retryTotalVotesCast } = useTotalVotesCastOnContest(address, chainId);

  const renderTotalVotesCast = () => {
    if (!totalVotesCast) return null;

    if (totalVotesCast.isLoading)
      return <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />;

    if (totalVotesCast.isError) {
      return (
        <span className="text-negative-11 font-bold underline cursor-pointer" onClick={() => retryTotalVotesCast()}>
          ruh-roh, try again!
        </span>
      );
    }

    return formatNumber(Number(totalVotesCast.data));
  };

  const renderTotalVotes = () => {
    if (isTotalVotesLoading) {
      return <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />;
    }

    if (isTotalVotesError) {
      return (
        <span className="text-negative-11 font-bold underline cursor-pointer" onClick={() => refetchTotalVotes()}>
          ruh-roh, try again!
        </span>
      );
    }

    if (isTotalVotesSuccess) {
      return formatNumber(totalVotes ?? 0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-1 md:items-center">
      <p className="text-[16px] text-neutral-11">
        {submissionsCount} submission{submissionsCount !== 1 ? "s" : ""}
      </p>
      <span className="hidden md:block">&#8226;</span>
      <div className="flex gap-1 items-center text-[16px] text-neutral-11">
        {renderTotalVotesCast()} {totalVotes === 0 ? "" : `out of ${renderTotalVotes()} `}votes deployed in contest
      </div>
    </div>
  );
};

export default ProposalStatisticsPanelVotingOpenOrClosed;
