import { ChartDataPoint } from "../types";

export const findDataPointByPrice = (data: ChartDataPoint[], targetPrice: number) => {
  const index = data.findIndex(item => Math.abs(item.pv - targetPrice) < 0.0001);
  return { index, point: data[index] || data[0] };
};
