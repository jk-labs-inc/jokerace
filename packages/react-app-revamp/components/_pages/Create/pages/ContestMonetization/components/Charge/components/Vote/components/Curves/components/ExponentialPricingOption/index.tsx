import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { calculateExponentialMultiple } from "lib/priceCurve";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/react/shallow";
import { validateCostToVote, validateStartAndEndPrice } from "../../../../../../validation";

interface ExponentialPricingOptionProps {
  chainUnitLabel: string;
  onError?: (value: boolean) => void;
}

const ExponentialPricingOption: FC<ExponentialPricingOptionProps> = ({ chainUnitLabel, onError }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [costToVoteStartPriceError, setCostToVoteStartPriceError] = useState("");
  const [costToVoteEndPriceError, setCostToVoteEndPriceError] = useState("");
  const { costToVoteEndPrice, costToVoteStartPrice, setCharge, setPriceCurve, minCostToVote, priceCurveType } =
    useDeployContestStore(
      useShallow(state => ({
        costToVoteStartPrice: state.charge.type.costToVoteStartPrice,
        costToVoteEndPrice: state.charge.type.costToVoteEndPrice,
        minCostToVote: state.minCharge.minCostToVote,
        priceCurveType: state.priceCurve.type,
        setCharge: state.setCharge,
        setPriceCurve: state.setPriceCurve,
      })),
    );

  useEffect(() => {
    if (!costToVoteEndPrice || !costToVoteStartPrice || priceCurveType === PriceCurveType.Flat) return;

    const error = validateStartAndEndPrice(costToVoteStartPrice, costToVoteEndPrice);
    if (error) {
      setCostToVoteEndPriceError(error);
      onError?.(true);
      return;
    } else {
      setCostToVoteEndPriceError("");
      onError?.(false);
    }

    if (costToVoteStartPrice > 0 && costToVoteEndPrice > 0 && costToVoteEndPrice > costToVoteStartPrice) {
      try {
        const multiple = calculateExponentialMultiple({
          startPrice: costToVoteStartPrice,
          endPrice: costToVoteEndPrice,
        });

        handleMultipleChange(multiple);
      } catch (error) {
        console.error("Error calculating exponential multiple:", error);
      }
    }
  }, [costToVoteStartPrice, costToVoteEndPrice, priceCurveType]);

  const handleMultipleChange = (value: number) => {
    setPriceCurve(prev => ({
      ...prev,
      multiple: value,
    }));
  };

  const handleCostToVoteEndPriceChange = (value: number) => {
    if (!costToVoteStartPrice) return;

    const error = validateStartAndEndPrice(costToVoteStartPrice, value);

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

  const handleCostToVoteStartPriceChange = (value: number | null) => {
    const error = validateCostToVote(value, minCostToVote);
    if (error) {
      setCostToVoteStartPriceError(error);
      onError?.(true);
      setCharge(prev => ({
        ...prev,
        error: true,
      }));
      return;
    } else {
      setCostToVoteStartPriceError("");
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
        costToVoteStartPrice: value ?? 0,
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
              value={costToVoteStartPrice ?? 0}
              onChange={handleCostToVoteStartPriceChange}
              label={chainUnitLabel}
              errorMessage={costToVoteStartPriceError}
            />
          </div>
        </div>
        <div
          className={`hidden md:flex self-center justify-center items-center ${
            costToVoteEndPriceError || costToVoteStartPriceError ? "mt-0" : "mt-6"
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
