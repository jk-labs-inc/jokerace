import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { FC } from "react";

interface ContestParamsChargeVoteProps {
  costToVote: number;
  chainUnitLabel: string;
  costToVoteError: string;
  onCostToVoteChange?: (value: number | null) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({
  costToVote,
  chainUnitLabel,
  costToVoteError,
  onCostToVoteChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        what is the charge for players each time they <b>vote</b>?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={costToVote}
          onChange={onCostToVoteChange}
          unitLabel={chainUnitLabel}
          errorMessage={costToVoteError}
          textClassName="font-bold text-center pl-0 pr-4"
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeVote;
