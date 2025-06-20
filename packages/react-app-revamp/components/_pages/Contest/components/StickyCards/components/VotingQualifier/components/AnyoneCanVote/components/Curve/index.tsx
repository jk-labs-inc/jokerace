import { useContestStore } from "@hooks/useContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierAnyoneCanVoteFlat from "../Flat";

const VotingQualifierAnyoneCanVoteCurve = () => {
  const { contestInfo, contestAbi } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
    })),
  );
  const { priceCurveType, isLoading, isError } = usePriceCurveType({
    address: contestInfo.contestAddress,
    abi: contestAbi,
    chainId: contestInfo.contestChainId,
  });

  //TODO: add loading and error states
  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error</p>;

  if (priceCurveType === PriceCurveType.Flat) {
    return <VotingQualifierAnyoneCanVoteFlat />;
  }

  return (
    <div>
      <p>VotingQualifierAnyoneCanVoteExponential</p>
    </div>
  );
};

export default VotingQualifierAnyoneCanVoteCurve;
