import { useMemo } from "react";
import { generatePricePoints } from "lib/priceCurve";
import { PricePoint } from "lib/priceCurve/types";

interface UsePriceCurvePointsParams {
  startPrice: number;
  multiple: number;
  startTime: Date;
  endTime: Date;
  updateIntervalSeconds?: number;
  enabled?: boolean;
}

interface PriceCurvePointsResult {
  pricePoints: PricePoint[];
  isLoading: boolean;
  isError: boolean;
}

const usePriceCurvePoints = ({
  startPrice,
  multiple,
  startTime,
  endTime,
  updateIntervalSeconds = 60,
  enabled = true,
}: UsePriceCurvePointsParams): PriceCurvePointsResult => {
  const pricePointsData = useMemo(() => {
    if (!enabled || !startPrice || !multiple || !startTime || !endTime) {
      return {
        pricePoints: [],
        isLoading: false,
        isError: false,
      };
    }

    try {
      const pricePoints = generatePricePoints({
        startPrice,
        multiple,
        startTime,
        endTime,
        updateIntervalSeconds,
      });

      return {
        pricePoints: pricePoints || [],
        isLoading: false,
        isError: false,
      };
    } catch (error) {
      console.error("Error generating price points:", error);
      return {
        pricePoints: [],
        isLoading: false,
        isError: true,
      };
    }
  }, [enabled, startPrice, multiple, startTime, endTime, updateIntervalSeconds]);

  return pricePointsData;
};

export default usePriceCurvePoints;
