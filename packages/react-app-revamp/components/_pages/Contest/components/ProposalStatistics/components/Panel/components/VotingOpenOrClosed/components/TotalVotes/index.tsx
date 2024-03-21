import { formatNumber } from "@helpers/formatNumber";
import useTotalVotesOnContest from "@hooks/useTotalVotes";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface ProposalStatisticsTotalVotesProps {
  address: string;
  chainId: number;
}

const ProposalStatisticsTotalVotes: FC<ProposalStatisticsTotalVotesProps> = ({ address, chainId }) => {
  const { totalVotes, refetchTotalVotes, isTotalVotesLoading, isTotalVotesError, isTotalVotesSuccess } =
    useTotalVotesOnContest(address, chainId);

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
    if (totalVotes === 0) return null;

    return <span>{` out of ${formatNumber(totalVotes ?? 0)}`}</span>;
  }

  return null;
};

export default ProposalStatisticsTotalVotes;
