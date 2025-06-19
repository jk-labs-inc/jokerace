import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { FC } from "react";

interface ContestParamsChargeSubmissionProps {
  costToPropose: number;
  costToProposeError: string;
  chainUnitLabel: string;
  onCostToProposeChange?: (value: number | null) => void;
}

const ContestParamsChargeSubmission: FC<ContestParamsChargeSubmissionProps> = ({
  costToPropose,
  chainUnitLabel,
  costToProposeError,
  onCostToProposeChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        what is the charge to <b>enter</b> the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateFlowMonetizationInput
          value={costToPropose}
          onChange={onCostToProposeChange}
          label={chainUnitLabel}
          errorMessage={costToProposeError}
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeSubmission;
