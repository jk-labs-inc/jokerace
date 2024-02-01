import { FC } from "react";

interface ContestParamsChargePercentToCreatorProps {
  percentageToCreator: number;
  minCostToPropose: number;
  minCostToVote: number;
  onPercentageToCreatorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContestParamsChargePercentToCreator: FC<ContestParamsChargePercentToCreatorProps> = ({
  percentageToCreator,
  onPercentageToCreatorChange,
  minCostToPropose,
  minCostToVote,
}) => {
  return (
    <div className="flex gap-6 flex-col">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        by default, we split all charges with you 50/50 so you can monetize
      </p>
      <div className="flex gap-4">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={percentageToCreator === 0}
            onChange={onPercentageToCreatorChange}
            disabled={minCostToPropose <= 0 || minCostToVote <= 0}
          />
          <span className="checkmark"></span>
        </label>
        <p
          className={`text-[16px] md:text-[24px] ${
            percentageToCreator === 0 ? "text-neutral-11" : "text-neutral-9"
          } md:-mt-2`}
        >
          give my 50% to support <span className="normal-case">JokeRace</span> instead
        </p>
      </div>
    </div>
  );
};

export default ContestParamsChargePercentToCreator;
