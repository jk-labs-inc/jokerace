import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { PriceCurveType } from "@hooks/useDeployContest/types";

export const usePriceCurveManager = () => {
  const { priceCurve, setPriceCurve } = useDeployContestStore(
    useShallow(state => ({
      priceCurve: state.priceCurve,
      setPriceCurve: state.setPriceCurve,
    })),
  );

  const handleCurveChange = useCallback(
    (value: PriceCurveType) => {
      const updates = value === PriceCurveType.Flat 
        ? { type: value, multiple: 1 }
        : { type: value };
      
      setPriceCurve({ ...priceCurve, ...updates });
    },
    [priceCurve, setPriceCurve],
  );

  const handleMultipleChange = useCallback(
    (multiple: number) => {
      setPriceCurve({ ...priceCurve, multiple });
    },
    [priceCurve, setPriceCurve],
  );

  return {
    priceCurve,
    handleCurveChange,
    handleMultipleChange,
  };
}; 