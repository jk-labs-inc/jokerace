import { useMemo } from "react";
import { ChartDataPoint } from "../types";

export interface ProcessedChartData {
  current: ChartDataPoint | null;
  hovered: {
    point: ChartDataPoint | null;
    price: number | null;
  };
  active: {
    point: ChartDataPoint;
    price: number;
  };
  dates: {
    first: string;
    last: string;
    active: string;
  };
  yAxisTicks: number[];
}

interface UseChartDataProps {
  data: ChartDataPoint[];
  currentPrice: number;
  currentIndex: number;
  hoveredIndex: number | null;
}

export const useChartData = ({
  data,
  currentPrice,
  currentIndex,
  hoveredIndex,
}: UseChartDataProps): ProcessedChartData => {
  return useMemo(() => {
    const currentPoint = data[currentIndex] || data[0];

    const hoveredData =
      hoveredIndex !== null
        ? { point: data[hoveredIndex], price: data[hoveredIndex].pv }
        : { point: null, price: null };

    const activePoint = hoveredData.point || currentPoint;
    const activePrice = hoveredData.price ?? currentPrice;

    return {
      current: currentPoint,
      hovered: hoveredData,
      active: { point: activePoint, price: activePrice },
      dates: {
        first: data[0]?.date,
        last: data[data.length - 1]?.date,
        active: activePoint?.date,
      },
      yAxisTicks: [...new Set(data.map(item => item.pv))].sort((a, b) => a - b),
    };
  }, [data, currentPrice, hoveredIndex]);
};
