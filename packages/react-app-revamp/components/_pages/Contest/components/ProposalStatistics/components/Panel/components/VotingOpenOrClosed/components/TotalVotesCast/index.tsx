import { formatNumber } from "@helpers/formatNumber";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import Skeleton from "react-loading-skeleton";

interface ProposalStatisticsTotalVotesCastProps {
  address: string;
  chainId: number;
}

const ProposalStatisticsTotalVotesCast: React.FC<ProposalStatisticsTotalVotesCastProps> = ({ address, chainId }) => {
  const { totalVotesCast, retry: retryTotalVotesCast } = useTotalVotesCastOnContest(address, chainId);

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

export default ProposalStatisticsTotalVotesCast;
