import { FC, useMemo } from "react";
import PriceCurveSelector from "./components/PriceCurveSelector";
import { usePriceCurveManager } from "./hooks/usePriceCurveManager";
import { createCurveOptions } from "./utils";
import { CreateContestChargeVoteCurvesProps } from "./types";

const CreateContestChargeVoteCurves: FC<CreateContestChargeVoteCurvesProps> = ({
  costToVote,
  label,
  errorMessage,
  costToVoteEndPrice,
  onCostToVoteEndPriceChange,
  onCostToVoteChange,
}) => {
  const { priceCurve, handleCurveChange, handleMultipleChange } = usePriceCurveManager();

  const curveOptions = useMemo(() => {
    const contentProps = {
      costToVote,
      costToVoteEndPrice,
      label,
      errorMessage,
      onCostToVoteChange,
      onCostToVoteEndPriceChange,
    };

    return createCurveOptions(priceCurve, contentProps, handleMultipleChange);
  }, [
    priceCurve,
    costToVote,
    label,
    errorMessage,
    onCostToVoteChange,
    handleMultipleChange,
    costToVoteEndPrice,
    onCostToVoteEndPriceChange,
  ]);

  return (
    <PriceCurveSelector selectedCurve={priceCurve.type} options={curveOptions} onCurveChange={handleCurveChange} />
  );
};

export default CreateContestChargeVoteCurves;
