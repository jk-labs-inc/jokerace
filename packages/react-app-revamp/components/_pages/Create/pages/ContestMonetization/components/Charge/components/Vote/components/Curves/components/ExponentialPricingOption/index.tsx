import { FC, useEffect, useState } from "react";
import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { calculateExponentialMultiple } from "@helpers/exponentialMultiplier";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/react/shallow";
import { validateCostToVote, validateStartAndEndPrice } from "../../../../../../validation";
import { useMediaQuery } from "react-responsive";
import { PriceCurveType } from "@hooks/useDeployContest/types";

interface ExponentialPricingOptionProps {
  chainUnitLabel: string;
  onError?: (value: boolean) => void;
}

const ExponentialPricingOption: FC<ExponentialPricingOptionProps> = ({ chainUnitLabel, onError }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [costToVoteError, setCostToVoteError] = useState("");
  const [costToVoteEndPriceError, setCostToVoteEndPriceError] = useState("");
  const { costToVote, costToVoteEndPrice, setCharge, setPriceCurve, minCostToVote, priceCurveType } =
    useDeployContestStore(
      useShallow(state => ({
        costToVote: state.charge.type.costToVote,
        costToVoteEndPrice: state.charge.type.costToVoteEndPrice,
        minCostToVote: state.minCharge.minCostToVote,
        priceCurveType: state.priceCurve.type,
        setCharge: state.setCharge,
        setPriceCurve: state.setPriceCurve,
      })),
    );

  useEffect(() => {
    if (!costToVoteEndPrice || priceCurveType === PriceCurveType.Flat) return;

    const error = validateStartAndEndPrice(costToVote, costToVoteEndPrice);
    if (error) {
      setCostToVoteEndPriceError(error);
      onError?.(true);
      return;
    } else {
      setCostToVoteEndPriceError("");
      onError?.(false);
    }

    if (costToVote > 0 && costToVoteEndPrice > 0 && costToVoteEndPrice > costToVote) {
      try {
        const multiple = calculateExponentialMultiple({
          startPrice: costToVote,
          endPrice: costToVoteEndPrice,
        });

        handleMultipleChange(multiple);
      } catch (error) {
        console.error("Error calculating exponential multiple:", error);
      }
    }
  }, [costToVote, costToVoteEndPrice, priceCurveType]);

  const handleMultipleChange = (value: number) => {
    setPriceCurve(prev => ({
      ...prev,
      multiple: value,
    }));
  };

  const handleCostToVoteEndPriceChange = (value: number) => {
    const error = validateStartAndEndPrice(costToVote, value);

    if (error) {
      setCostToVoteEndPriceError(error);
      onError?.(true);
      return;
    } else {
      setCostToVoteEndPriceError("");
      onError?.(false);
    }

    setCharge(prev => ({
      ...prev,
      type: { ...prev.type, costToVoteEndPrice: value },
    }));
  };

  const handleCostToVoteChange = (value: number | null) => {
    const error = validateCostToVote(value, minCostToVote);
    if (error) {
      setCostToVoteError(error);
      onError?.(true);
      setCharge(prev => ({
        ...prev,
        error: true,
      }));
      return;
    } else {
      setCostToVoteError("");
    }

    if (costToVoteEndPrice) {
      const endPriceError = validateStartAndEndPrice(value ?? 0, costToVoteEndPrice);
      if (endPriceError) {
        setCostToVoteEndPriceError(endPriceError);
        onError?.(true);
      } else {
        setCostToVoteEndPriceError("");
        onError?.(false);
      }
    } else {
      onError?.(false);
    }

    setCharge(prev => ({
      ...prev,
      type: {
        ...prev.type,
        costToVote: value ?? 0,
      },
      error: false,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[16px] text-neutral-9">
        {isMobile ? (
          <>
            this will generate an exponential price curve <br /> so the price increases every minute.
          </>
        ) : (
          <>
            set the price at start and finish of contest. this will generate an <br />
            exponential price curve so the price increases every minute.
          </>
        )}
      </p>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-neutral-9">price at start</p>
          <div className="flex-1 flex items-end">
            <CreateFlowMonetizationInput
              value={costToVote}
              onChange={handleCostToVoteChange}
              label={chainUnitLabel}
              errorMessage={costToVoteError}
            />
          </div>
        </div>
        {/* TODO: check centering style here, maybe use a grid layout*/}
        <div
          className={`hidden md:flex self-center justify-center items-center ${
            costToVoteEndPriceError || costToVoteError ? "mt-0" : "mt-6"
          }`}
        >
          <p className="text-[40px] font-bold text-neutral-10">to</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-neutral-9">price at finish</p>
          <div className="flex-1 flex items-end">
            <CreateFlowMonetizationInput
              value={costToVoteEndPrice ?? 0}
              onChange={handleCostToVoteEndPriceChange}
              label={chainUnitLabel}
              errorMessage={costToVoteEndPriceError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExponentialPricingOption;
