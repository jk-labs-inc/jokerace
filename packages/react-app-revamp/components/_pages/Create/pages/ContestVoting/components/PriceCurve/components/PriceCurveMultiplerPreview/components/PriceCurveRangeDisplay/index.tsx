import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import PriceDisplay from "./components/PriceDisplay";
import { useMediaQuery } from "react-responsive";

interface PriceCurveRangeDisplayProps {
  chainUnitLabel: string;
}

const PriceCurveRangeDisplay: FC<PriceCurveRangeDisplayProps> = ({ chainUnitLabel }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { costToVoteStartPrice, costToVoteEndPrice } = useDeployContestStore(
    useShallow(state => ({
      costToVoteStartPrice: state.charge.type.costToVoteStartPrice,
      costToVoteEndPrice: state.charge.type.costToVoteEndPrice,
    })),
  );

  return (
    <div className="flex items-end gap-4 md:gap-6">
      <PriceDisplay price={costToVoteStartPrice?.toString() ?? ""} label="start" chainUnitLabel={chainUnitLabel} />

      <div className="pb-2">
        <img
          src={isMobile ? "/create-flow/arrow-mobile.svg" : "/create-flow/arrow.svg"}
          alt="arrow right"
          className="w-12 md:w-full"
        />
      </div>

      <PriceDisplay price={costToVoteEndPrice?.toString() ?? ""} label="finish" chainUnitLabel={chainUnitLabel} />
    </div>
  );
};

export default PriceCurveRangeDisplay;
