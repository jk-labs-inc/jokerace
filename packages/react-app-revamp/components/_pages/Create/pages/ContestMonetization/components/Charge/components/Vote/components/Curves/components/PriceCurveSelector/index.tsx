import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface PriceCurveSelectorProps {
  selectedCurve: PriceCurveType;
  options: RadioOption[];
  onCurveChange: (curve: PriceCurveType) => void;
}

const PriceCurveSelector: FC<PriceCurveSelectorProps> = ({ selectedCurve, options, onCurveChange }) => {
  return (
    <CreateRadioButtonsGroup value={selectedCurve} onChange={onCurveChange} options={options} className="w-full" />
  );
};

export default PriceCurveSelector;
