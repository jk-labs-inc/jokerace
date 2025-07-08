import { useContestStore } from "@hooks/useContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { useShallow } from "zustand/react/shallow";
import ChargeInfoFlat from "./Flat";
import ChargeInfoExponential from "./Exponential";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";

const ChargeInfoCurve = () => {
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
    return <ChargeInfoFlat />;
  }

  return <ChargeInfoExponential />;
};

export default ChargeInfoCurve;
