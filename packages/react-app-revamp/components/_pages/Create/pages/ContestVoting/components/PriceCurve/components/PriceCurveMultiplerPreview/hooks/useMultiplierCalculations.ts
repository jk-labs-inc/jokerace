import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Charge, PriceCurve } from "@hooks/useDeployContest/types";
import { calculateExponentialMultiple } from "lib/priceCurve";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";

const validateMultiplier = (value: number): string => {
  if (value < 8.0) {
    return "multiplier must be at least 8x";
  }

  if (value > 20.0) {
    return "multiplier cannot exceed 20x";
  }

  return "";
};

const calculatePricesAndMultiple = (
  startPrice: number,
  multipler: number,
  setCharge: (updater: Charge | ((prev: Charge) => Charge)) => void,
  setPriceCurve: (updater: PriceCurve | ((prev: PriceCurve) => PriceCurve)) => void,
) => {
  if (!startPrice || startPrice <= 0) return;

  const endPrice = startPrice * multipler;

  setCharge((prev: Charge) => ({
    ...prev,
    costToVote: startPrice,
    costToVoteEndPrice: endPrice,
  }));

  try {
    const multiple = calculateExponentialMultiple({
      startPrice,
      endPrice,
    });

    setPriceCurve((prev: PriceCurve) => ({
      ...prev,
      multiple,
    }));
  } catch (error) {
    console.error("Error calculating exponential multiple:", error);
  }
};

export const useMultiplierCalculations = (onError?: (hasError: boolean) => void) => {
  const { multipler, costToVote, setCharge, setPriceCurve } = useDeployContestStore(
    useShallow(state => ({
      multipler: state.priceCurve.multipler,
      costToVote: state.charge.costToVote,
      setCharge: state.setCharge,
      setPriceCurve: state.setPriceCurve,
    })),
  );

  const [errorMessage, setErrorMessage] = useState("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !costToVote || costToVote <= 0) return;

    hasInitialized.current = true;

    const error = validateMultiplier(multipler);
    if (error) {
      setErrorMessage(error);
      onError?.(true);
      return;
    }

    calculatePricesAndMultiple(costToVote, multipler, setCharge, setPriceCurve);
  }, [costToVote, multipler, setCharge, setPriceCurve, onError]);

  const handleMultiplierChange = (value: number) => {
    setPriceCurve(prev => ({
      ...prev,
      multipler: value,
    }));

    const error = validateMultiplier(value);
    setErrorMessage(error);
    onError?.(!!error);

    // Calculate regardless of error to show UI feedback
    if (costToVote > 0) {
      calculatePricesAndMultiple(costToVote, value, setCharge, setPriceCurve);
    }
  };

  return {
    multipler,
    errorMessage,
    handleMultiplierChange,
  };
};
