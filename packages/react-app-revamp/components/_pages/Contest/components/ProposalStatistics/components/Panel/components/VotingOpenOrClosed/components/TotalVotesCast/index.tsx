import { formatNumberWithCommas } from "@helpers/formatNumber";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import Skeleton from "react-loading-skeleton";

interface ProposalStatisticsTotalVotesCastProps {
  address: string;
  chainId: number;
}

const ProposalStatisticsTotalVotesCast: React.FC<ProposalStatisticsTotalVotesCastProps> = ({ address, chainId }) => {
  const {
    totalVotesCast,
    refetch: refetchTotalVotesCast,
    isLoading,
    isError,
  } = useTotalVotesCastOnContest(address, chainId);

  if (!totalVotesCast) return null;

  if (isLoading) return <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />;

  if (isError) {
    return (
      <span className="text-negative-11 font-bold underline cursor-pointer" onClick={() => refetchTotalVotesCast()}>
        ruh-roh, try again!
      </span>
    );
  }

  return <span>{formatNumberWithCommas(Number(totalVotesCast))}</span>;
};

export default ProposalStatisticsTotalVotesCast;
