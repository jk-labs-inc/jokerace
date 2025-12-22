import { FC } from "react";
import ChargeInfoExponential from "./Exponential";

interface ChargeInfoCurveProps {
  costToVote: string;
}

const ChargeInfoCurve: FC<ChargeInfoCurveProps> = ({ costToVote }) => {
  return <ChargeInfoExponential costToVote={costToVote} />;
};

export default ChargeInfoCurve;
