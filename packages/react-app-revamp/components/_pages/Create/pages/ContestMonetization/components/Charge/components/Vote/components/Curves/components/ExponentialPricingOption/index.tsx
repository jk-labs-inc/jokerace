import { FC, useEffect, useState } from "react";
import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { calculateExponentialMultiple } from "@helpers/exponentialMultiplier";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/react/shallow";

interface ExponentialPricingOptionProps {
  costToVote: number;
  costToVoteEndPrice?: number;
  chainUnitLabel: string;
  errorMessage?: string;
  onCostToVoteChange?: (value: number) => void;
  onCostToVoteEndPriceChange?: (value: number) => void;
  onMultipleChange?: (value: number) => void;
}

const ExponentialPricingOption: FC<ExponentialPricingOptionProps> = ({
  costToVote,
  costToVoteEndPrice,
  chainUnitLabel,
  errorMessage,
  onCostToVoteChange,
  onCostToVoteEndPriceChange,
  onMultipleChange,
}) => {
  const [startPrice, setStartPrice] = useState(costToVote);
  const [endPrice, setEndPrice] = useState(costToVoteEndPrice ?? 0);

  useEffect(() => {
    if (startPrice > 0 && endPrice > 0 && endPrice > startPrice) {
      try {
        const multiple = calculateExponentialMultiple({
          startPrice,
          endPrice,
        });

        if (onMultipleChange) {
          onMultipleChange(multiple);
        }
      } catch (error) {
        console.error("Error calculating exponential multiple:", error);
      }
    }
  }, [startPrice, endPrice]);

  useEffect(() => {
    setStartPrice(costToVote);
    setEndPrice(costToVoteEndPrice ?? 0);
  }, [costToVote, costToVoteEndPrice]);

  const handleEndPriceChange = (value: number) => {
    setEndPrice(value);
    onCostToVoteEndPriceChange?.(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[16px] text-neutral-9">
        set the price at start and finish of contest. this will generate an <br />
        exponential price curve so the price increases every minute.
      </p>
      <div className="flex gap-6 items-end">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-neutral-9">price at start</p>
          <CreateFlowMonetizationInput
            value={costToVote}
            onChange={onCostToVoteChange}
            label={chainUnitLabel}
            errorMessage={errorMessage}
          />
        </div>
        <p className="text-[40px] font-bold text-neutral-10">to</p>
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-neutral-9">price at finish</p>
          <CreateFlowMonetizationInput
            value={endPrice}
            onChange={handleEndPriceChange}
            label={chainUnitLabel}
            errorMessage={endPrice <= startPrice && endPrice > 0 ? "End price must be greater than start price" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ExponentialPricingOption;
