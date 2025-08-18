import { useMemo } from "react";
import { PricePoint } from "lib/priceCurve/types";
import { ChartDataPoint } from "components/_pages/Contest/components/PriceCurveChart/types";

export interface PriceCurveChartData {
  chartData: ChartDataPoint[];
  currentPrice: number;
}

interface UsePriceCurveChartDataParams {
  pricePoints: PricePoint[];
  currentTime?: Date;
}

const usePriceCurveChartData = ({
  pricePoints,
  currentTime = new Date(),
}: UsePriceCurveChartDataParams): PriceCurveChartData => {
  const chartData = useMemo(() => {
    // Handle empty or invalid data
    if (!pricePoints || pricePoints.length === 0) {
      return {
        chartData: [],
        currentPrice: 0,
      };
    }

    // Find current price index based on current time
    const currentIndex = findCurrentPriceIndex(pricePoints, currentTime);

    // Create sliding window of price points
    const windowPricePoints = pricePoints;

    // Convert to ChartDataPoint format
    const chartDataPoints = convertToChartData(windowPricePoints);

    // Get current price as number
    const currentPriceValue = getCurrentPriceValue(pricePoints, currentIndex);

    return {
      chartData: chartDataPoints,
      currentPrice: currentPriceValue,
    };
  }, [pricePoints, currentTime]);

  return chartData;
};

const findCurrentPriceIndex = (pricePoints: PricePoint[], currentTime: Date): number => {
  const currentTimestamp = currentTime.getTime();

  // Find the price that should be active right now
  for (let i = 0; i < pricePoints.length; i++) {
    const pointTimestamp = new Date(pricePoints[i].date).getTime();

    // If this is the last point, or current time is before the next point
    if (i === pricePoints.length - 1 || currentTimestamp < new Date(pricePoints[i + 1].date).getTime()) {
      // If current time is at or after this point's time, this is the active price
      if (currentTimestamp >= pointTimestamp) {
        return i;
      }
    }
  }

  // If current time is before all price points, return -1 (not started)
  return -1;
};

const convertToChartData = (pricePoints: PricePoint[]): ChartDataPoint[] => {
  return pricePoints.map((point, index) => ({
    id: `Point ${index + 1}`,
    date: point.date,
    pv: parseFloat(point.price),
  }));
};

const getCurrentPriceValue = (pricePoints: PricePoint[], currentIndex: number): number => {
  if (currentIndex < 0 || currentIndex >= pricePoints.length) {
    return pricePoints[0] ? parseFloat(pricePoints[0].price) : 0;
  }

  return parseFloat(pricePoints[currentIndex].price);
};

export default usePriceCurveChartData;
