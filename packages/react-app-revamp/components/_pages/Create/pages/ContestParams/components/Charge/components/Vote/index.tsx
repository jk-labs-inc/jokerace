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
    <div className="flex flex-col gap-6">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        what is the charge for players to vote in the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={costToVote}
          onChange={onCostToVoteChange}
          unitLabel={chainUnitLabel}
          errorMessage={costToVoteError}
        />
      </div>
    </div>
  );
};

export default ContestParamsChargeVote;
