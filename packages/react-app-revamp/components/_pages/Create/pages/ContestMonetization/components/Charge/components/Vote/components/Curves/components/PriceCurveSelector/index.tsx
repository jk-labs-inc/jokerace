import CreateRadioButtonsGroup from "@components/_pages/Create/components/RadioButtonsGroup";
import { RadioButtonsGroupType, RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup/types";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface PriceCurveSelectorProps {
  selectedCurve: PriceCurveType;
  options: RadioOption[];
  onCurveChange: (curve: PriceCurveType) => void;
}

const PriceCurveSelector: FC<PriceCurveSelectorProps> = ({ selectedCurve, options, onCurveChange }) => {
  return (
    <CreateRadioButtonsGroup
      type={RadioButtonsGroupType.NORMAL}
      gapClassName="gap-8"
      value={selectedCurve}
      onChange={onCurveChange}
      options={options}
      className="w-full"
    />
  );
};

export default PriceCurveSelector;
