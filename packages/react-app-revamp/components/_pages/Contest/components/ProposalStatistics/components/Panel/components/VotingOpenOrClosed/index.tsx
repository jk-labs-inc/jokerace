/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import useTotalVotesOnContest from "@hooks/useTotalVotes";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { useTotalVotesCastStore } from "@hooks/useTotalVotesCastOnContest/store";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
interface ProposalStatisticsPanelVotingOpenOrClosedProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelVotingOpenOrClosed: FC<ProposalStatisticsPanelVotingOpenOrClosedProps> = ({
  submissionsCount,
}) => {
  const router = useRouter();
  const asPath = router.asPath;
  const { address, chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const {
    isLoading: isTotalVotesLoading,
    isError: isTotalVotesError,
    totalVotes,
    retry: retryTotalVotes,
  } = useTotalVotesOnContest(address, chainId);
  const { fetchTotalVotesCast, retry: retryTotalVotesCast } = useTotalVotesCastOnContest(address, chainId);
  const {
    totalVotesCast,
    isLoading: isTotalVotesCastLoading,
    isError: isTotalVotesCastError,
  } = useTotalVotesCastStore(state => state);

  useEffect(() => {
    fetchTotalVotesCast();
  }, [address, chainId]);

  const renderTotalVotesCast = () => {
    if (isTotalVotesCastLoading)
      return <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />;

    if (isTotalVotesCastError) {
      return (
        <span className="text-negative-11 font-bold underline cursor-pointer" onClick={retryTotalVotesCast}>
          ruh-roh, try again!
        </span>
      );
    }

    return formatNumber(totalVotesCast);
  };

  const renderTotalVotes = () => {
    if (isTotalVotesLoading)
      return <Skeleton width={50} height={16} baseColor="#706f78" highlightColor="#78FFC6" duration={1} />;

    if (isTotalVotesError) {
      return (
        <span className="text-negative-11 font-bold underline cursor-pointer" onClick={retryTotalVotes}>
          ruh-roh, try again!
        </span>
      );
    }

    return formatNumber(totalVotes);
  };

  return (
    <div className="flex gap-1 items-center">
      <p className="text-[16px] text-neutral-11">
        {submissionsCount} submission{submissionsCount > 1 ? "s" : ""}
      </p>
      &#8226;
      <div className="flex gap-1 items-center text-[16px] text-neutral-11">
        {renderTotalVotesCast()} out of {renderTotalVotes()} votes deployed in contest
      </div>
    </div>
  );
};

export default ProposalStatisticsPanelVotingOpenOrClosed;
