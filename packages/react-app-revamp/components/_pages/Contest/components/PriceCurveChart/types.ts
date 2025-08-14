import { SVGProps } from "react";

export interface ChartDataPoint {
  id: string;
  date: string; // ISO date string
  pv: number; // Price value in ETH
}

export interface PriceCurveChartProps {
  data?: ChartDataPoint[]; // Chart data points
  currentPrice?: number; // Current price that exists in the data array
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
}

export interface PriceCurveWrapperProps {
  contestAddress?: string;
  chainId?: number;
  startDate?: Date;
  endDate?: Date;
  currentPriceETH?: number; // Current price in ETH
}

// Legacy SVG-based axis props (can be removed if not used elsewhere)
export interface AxisTickProps extends SVGProps<SVGTextElement> {
  x: number;
  y: number;
  payload: {
    value: any;
    index: number;
  };
  index: number;
  currentPrice: number;
  hoveredPrice: number | null;
}
