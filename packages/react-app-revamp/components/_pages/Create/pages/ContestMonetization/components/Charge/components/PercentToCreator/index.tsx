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
    <div className="flex flex-col gap-4 ">
      <p className="text-[20px] md:text-[20px] text-neutral-11">
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
          className={`text-[16px] md:text-[20px] ${
            percentageToCreator === 0 ? "text-neutral-11" : "text-neutral-9"
          } md:-mt-1`}
        >
          i prefer to take 0% of charges so that i don’t make any money
        </p>
      </div>
    </div>
  );
};

export default ContestParamsChargePercentToCreator;
