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

    // Create sliding window of price points (for now we will use all price points)
    const windowPricePoints = pricePoints;

    const chartDataPoints = convertToChartData(windowPricePoints);

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

  // Find the most recent price point that has already started
  let activeIndex = -1;

  for (let i = 0; i < pricePoints.length; i++) {
    const pointTimestamp = new Date(pricePoints[i].date).getTime();

    // If this price point's time has passed, it could be the active one
    if (currentTimestamp >= pointTimestamp) {
      activeIndex = i;
    } else {
      // Once we hit a future price point, stop looking
      break;
    }
  }

  return activeIndex;
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
