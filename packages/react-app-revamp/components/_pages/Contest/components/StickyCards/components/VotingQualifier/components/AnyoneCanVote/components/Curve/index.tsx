import useContestConfigStore from "@hooks/useContestConfig/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierError from "../../../../shared/Error";
import VotingQualifierSkeleton from "../../../../shared/Skeleton";
import VotingQualifierAnyoneCanVoteExponential from "../Exponential";
import VotingQualifierAnyoneCanVoteFlat from "../Flat";

interface VotingQualifierAnyoneCanVoteCurveProps {
  votingTimeLeft: number;
}

const VotingQualifierAnyoneCanVoteCurve: FC<VotingQualifierAnyoneCanVoteCurveProps> = ({ votingTimeLeft }) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { address, abi, chainId } = contestConfig;
  const { priceCurveType, isLoading, isError, refetch } = usePriceCurveType({
    address,
    abi,
    chainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;

  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  if (priceCurveType === PriceCurveType.Flat) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return <VotingQualifierAnyoneCanVoteExponential votingTimeLeft={votingTimeLeft} />;
};

export default VotingQualifierAnyoneCanVoteCurve;
