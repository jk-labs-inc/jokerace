import { FC } from "react";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const percentageTitle = isMobile
    ? "we split all charges with you 50/50"
    : " by default, we split all charges with you 50/50 so you can monetize";
  const percentageToCreatorTitle = isMobile
    ? `i prefer 0% so i don’t make money`
    : `i prefer to take 0% of charges so that i don’t make any money`;
  return (
    <div className="flex flex-col gap-4 ">
      <p className="text-[20px] md:text-[20px] text-neutral-11">{percentageTitle}</p>
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
          {percentageToCreatorTitle}
        </p>
      </div>
    </div>
  );
};

export default ContestParamsChargePercentToCreator;
