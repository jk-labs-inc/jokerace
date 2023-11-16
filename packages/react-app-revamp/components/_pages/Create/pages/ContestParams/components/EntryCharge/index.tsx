import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { EntryCharge } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface ContestParamsEntryChargeProps {
  entryCharge: EntryCharge;
  entryChargeError: string;
  minCostToPropose: number;
  chainUnitLabel: string | undefined;
  onEntryChargeValueChange: (value: number | null) => void;
  onEntryChargePercentageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContestParamsEntryCharge: FC<ContestParamsEntryChargeProps> = ({
  entryCharge,
  entryChargeError,
  minCostToPropose,
  chainUnitLabel,
  onEntryChargeValueChange,
  onEntryChargePercentageChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        what is the entry charge for players to submit to the contest?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={entryCharge.costToPropose}
          onChange={onEntryChargeValueChange}
          unitLabel={chainUnitLabel}
          errorMessage={entryChargeError}
        />
        {!entryChargeError && (
          <p className="text-[16px] font-bold text-neutral-14">
            this can help keep out bots, and we’ll split it with you 50/50
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={entryCharge.percentageToCreator === 0}
            onChange={onEntryChargePercentageChange}
            disabled={minCostToPropose <= 0}
          />
          <span className="checkmark"></span>
        </label>
        <p
          className={`text-[16px] md:text-[24px] ${
            entryCharge.percentageToCreator === 0 ? "text-neutral-11" : "text-neutral-9"
          } md:-mt-2`}
        >
          give my 50% to support <span className="normal-case">JokeRace</span> instead
        </p>
      </div>
    </div>
  );
};

export default ContestParamsEntryCharge;
