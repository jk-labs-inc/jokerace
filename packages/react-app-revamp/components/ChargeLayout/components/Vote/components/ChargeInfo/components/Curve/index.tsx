import { PriceCurveType } from "@hooks/useDeployContest/types";
import { FC } from "react";
import ChargeInfoExponential from "./Exponential";
import ChargeInfoFlat from "./Flat";

interface ChargeInfoCurveProps {
  costToVote: bigint;
  priceCurveType: PriceCurveType;
}

const ChargeInfoCurve: FC<ChargeInfoCurveProps> = ({ costToVote, priceCurveType }) => {
  if (priceCurveType === PriceCurveType.Flat) {
    return <ChargeInfoFlat costToVote={costToVote} />;
  }

  return <ChargeInfoExponential />;
};

export default ChargeInfoCurve;
