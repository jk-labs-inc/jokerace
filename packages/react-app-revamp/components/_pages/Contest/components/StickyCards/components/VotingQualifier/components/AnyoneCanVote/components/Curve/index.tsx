import { useContestStore } from "@hooks/useContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAnyoneCanVoteFlat from "../Flat";
import VotingQualifierAnyoneCanVoteExponential from "../Exponential";
import VotingQualifierSkeleton from "../../../../shared/Skeleton";
import VotingQualifierError from "../../../../shared/Error";

interface VotingQualifierAnyoneCanVoteCurveProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVoteCurve: FC<VotingQualifierAnyoneCanVoteCurveProps> = ({ votingTimeLeft }) => {
  const { contestInfo, contestAbi } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const { priceCurveType, isLoading, isError, refetch } = usePriceCurveType({
    address: contestInfo.contestAddress,
    abi: contestAbi,
    chainId: contestInfo.contestChainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;

  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  if (priceCurveType === PriceCurveType.Flat) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteExponential votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVoteCurve;
