import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        {isMobile ? (
          <>
            what’s the charge to <b>submit</b>?
          </>
        ) : (
          <>
            what is the entry charge for players to <b>submit</b> to the contest?
          </>
        )}
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          className="text-center"
          value={costToPropose}
          onChange={onCostToProposeChange}
          unitLabel={chainUnitLabel}
          errorMessage={costToProposeError}
          textClassName="font-bold text-center pl-0 pr-4 -ml-4"
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeSubmission;
