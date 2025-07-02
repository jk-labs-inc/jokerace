import { FC } from "react";
import VotingQualifierAnyoneCanVoteExponentialTimer from "./components/Timer";
import VotingQualifierAnyoneCanVoteExponentialVotePrice from "./components/VotePrice";
import { useContestStore } from "@hooks/useContest/store";
import { useShallow } from "zustand/react/shallow";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";

interface VotingQualifierAnyoneCanVoteExponentialProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVoteExponential: FC<VotingQualifierAnyoneCanVoteExponentialProps> = ({
  votingTimeLeft,
}) => {
  const { contestInfoData, contestAbi } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const { priceCurveUpdateInterval, isLoading, isError } = usePriceCurveUpdateInterval({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex items-center gap-1 md:gap-2">
        {/* TODO: check quality of image */}
        <img src="/contest/price-interval.png" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] font-bold text-neutral-9">price per vote</p>
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
