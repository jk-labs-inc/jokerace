import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import PriceCurveSelector from "./components/PriceCurveSelector";
import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import FlatPricingOption from "./components/FlatPricingOption";
import { PRICE_CURVE_LABELS } from "./constants";
import ExponentialPricingOption from "./components/ExponentialPricingOption";
import { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup/types";

interface CreateContestChargeVoteCurvesProps {
  label: string;
  onError?: (value: boolean) => void;
}

const CreateContestChargeVoteCurves: FC<CreateContestChargeVoteCurvesProps> = ({ label, onError }) => {
  const { priceCurve, setPriceCurve } = useDeployContestStore(
    useShallow(state => ({
      priceCurve: state.priceCurve,
      setPriceCurve: state.setPriceCurve,
    })),
  );

  const getOptions = (): RadioOption[] => {
    return [
      {
        label: PRICE_CURVE_LABELS[PriceCurveType.Flat],
        value: PriceCurveType.Flat,
        content: <FlatPricingOption label={label} onError={onError} />,
      },
      {
        label: PRICE_CURVE_LABELS[PriceCurveType.Exponential].desktop,
        mobileLabel: PRICE_CURVE_LABELS[PriceCurveType.Exponential].mobile,
        value: PriceCurveType.Exponential,
        content: <ExponentialPricingOption chainUnitLabel={label} onError={onError} />,
      },
    ];
  };

  const handleCurveTypeChange = (value: PriceCurveType) => {
    setPriceCurve(prev => ({
      ...prev,
      type: value,
    }));
  };

  return (
    <PriceCurveSelector selectedCurve={priceCurve.type} options={getOptions()} onCurveChange={handleCurveTypeChange} />
  );
};

export default CreateContestChargeVoteCurves;
