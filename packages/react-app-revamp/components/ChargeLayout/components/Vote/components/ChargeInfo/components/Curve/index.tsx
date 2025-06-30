import { useContestStore } from "@hooks/useContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { useShallow } from "zustand/react/shallow";
import ChargeInfoFlat from "./Flat";
import ChargeInfoExponential from "./Exponential";

const ChargeInfoCurve = () => {
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

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error</p>;

  if (priceCurveType === PriceCurveType.Flat) {
    return <ChargeInfoFlat />;
  }

  return <ChargeInfoExponential />;
};

export default ChargeInfoCurve;
