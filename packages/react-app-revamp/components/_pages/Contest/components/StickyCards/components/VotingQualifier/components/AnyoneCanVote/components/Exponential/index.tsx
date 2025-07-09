import { FC } from "react";
import VotingQualifierAnyoneCanVoteExponentialTimer from "./components/Timer";
import VotingQualifierAnyoneCanVoteExponentialVotePrice from "./components/VotePrice";
import { useContestStore } from "@hooks/useContest/store";
import { useShallow } from "zustand/react/shallow";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import VotingQualifierSkeleton from "../../../../shared/Skeleton";
import VotingQualifierError from "../../../../shared/Error";
import { useMediaQuery } from "react-responsive";

interface VotingQualifierAnyoneCanVoteExponentialProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVoteExponential: FC<VotingQualifierAnyoneCanVoteExponentialProps> = ({
  votingTimeLeft,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestInfoData, contestAbi, contestVersion } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
      contestVersion: state.version,
    })),
  );
  const { priceCurveUpdateInterval, isLoading, isError, refetch } = usePriceCurveUpdateInterval({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
    version: contestVersion,
  });

  if (isLoading) {
    return <VotingQualifierSkeleton />;
  }

  if (isError) {
    return <VotingQualifierError onClick={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex items-center gap-1 md:gap-2">
        <img src="/contest/price-interval.svg" alt="timer" />
        <p className="text-[12px] md:text-[16px] font-bold text-neutral-9">{isMobile ? "price" : "price per vote"}</p>
        <VotingQualifierAnyoneCanVoteExponentialTimer
          votingTimeLeft={votingTimeLeft}
          priceCurveUpdateInterval={priceCurveUpdateInterval}
        />
      </div>
      <VotingQualifierAnyoneCanVoteExponentialVotePrice />
    </div>
  );
};

export default VotingQualifierAnyoneCanVoteExponential;
