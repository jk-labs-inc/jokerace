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
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        what is the entry charge for players to <b>submit</b> to the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          className="text-center"
          value={costToPropose}
          onChange={onCostToProposeChange}
          unitLabel={chainUnitLabel}
          errorMessage={costToProposeError}
          textClassName="font-bold text-center pl-0 pr-4"
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeSubmission;
