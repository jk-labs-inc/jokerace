import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
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
    <div className="flex flex-col gap-6">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        what is the charge for players to submit to the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={costToPropose}
          onChange={onCostToProposeChange}
          unitLabel={chainUnitLabel}
          errorMessage={costToProposeError}
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeSubmission;
