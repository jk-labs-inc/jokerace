import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import VotingQualifierSkeleton from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Skeleton";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { useShallow } from "zustand/react/shallow";
import ChargeInfoExponential from "./Exponential";
import ChargeInfoFlat from "./Flat";

const ChargeInfoCurve = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { priceCurveType, isLoading, isError, refetch } = usePriceCurveType({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  if (isLoading) return <VotingQualifierSkeleton />;

  if (isError) return <VotingQualifierError onClick={() => refetch()} />;

  if (priceCurveType === PriceCurveType.Flat) {
    return <ChargeInfoFlat />;
  }

  return <ChargeInfoExponential />;
};

export default ChargeInfoCurve;
