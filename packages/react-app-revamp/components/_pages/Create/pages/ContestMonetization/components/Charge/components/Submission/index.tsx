import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/react/shallow";
import { FC, useState } from "react";
import { validateCostToPropose } from "../../validation";

interface ContestParamsChargeSubmissionProps {
  chainUnitLabel: string;
  onError?: (value: boolean) => void;
}

const ContestParamsChargeSubmission: FC<ContestParamsChargeSubmissionProps> = ({ chainUnitLabel, onError }) => {
  const [costToProposeError, setCostToProposeError] = useState("");
  const { costToPropose, minCostToPropose, setCharge } = useDeployContestStore(
    useShallow(state => ({
      costToPropose: state.charge.type.costToPropose,
      minCostToPropose: state.minCharge.minCostToPropose,
      setCharge: state.setCharge,
    })),
  );

  const handleCostToProposeChange = (value: number | null) => {
    const error = validateCostToPropose(value, minCostToPropose);
    if (error) {
      setCostToProposeError(error);
      onError?.(true);
      setCharge(prev => ({
        ...prev,
        error: true,
      }));
      return;
    } else {
      setCostToProposeError("");
      onError?.(false);
    }

    setCharge(prev => ({
      ...prev,
      type: {
        ...prev.type,
        costToPropose: value ?? 0,
      },
      error: false,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        what is the charge to <b>enter</b> the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateFlowMonetizationInput
          value={costToPropose}
          onChange={handleCostToProposeChange}
          label={chainUnitLabel}
          errorMessage={costToProposeError}
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeSubmission;
