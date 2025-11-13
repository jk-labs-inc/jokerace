import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Charge, PriceCurve } from "@hooks/useDeployContest/types";
import { calculateExponentialMultiple } from "lib/priceCurve";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";

const validateMultiplier = (value: number): string => {
  if (value <= 1.0) {
    return "finish price must be higher than start price";
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
    type: {
      ...prev.type,
      costToVoteStartPrice: startPrice,
      costToVoteEndPrice: endPrice,
    },
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
  const { multipler, costToVoteStartPrice, setCharge, setPriceCurve } = useDeployContestStore(
    useShallow(state => ({
      multipler: state.priceCurve.multipler,
      costToVoteStartPrice: state.charge.type.costToVoteStartPrice,
      setCharge: state.setCharge,
      setPriceCurve: state.setPriceCurve,
    })),
  );

  const [errorMessage, setErrorMessage] = useState("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !costToVoteStartPrice || costToVoteStartPrice <= 0) return;

    hasInitialized.current = true;

    const error = validateMultiplier(multipler);
    if (error) {
      setErrorMessage(error);
      onError?.(true);
      return;
    }

    calculatePricesAndMultiple(costToVoteStartPrice, multipler, setCharge, setPriceCurve);
  }, [costToVoteStartPrice, multipler, setCharge, setPriceCurve, onError]);

  const handleMultiplierChange = (value: number) => {
    setPriceCurve(prev => ({
      ...prev,
      multipler: value,
    }));

    const error = validateMultiplier(value);
    setErrorMessage(error);
    onError?.(!!error);

    // Calculate regardless of error to show UI feedback
    if (costToVoteStartPrice && costToVoteStartPrice > 0) {
      calculatePricesAndMultiple(costToVoteStartPrice, value, setCharge, setPriceCurve);
    }
  };

  return {
    multipler,
    errorMessage,
    handleMultiplierChange,
  };
};
