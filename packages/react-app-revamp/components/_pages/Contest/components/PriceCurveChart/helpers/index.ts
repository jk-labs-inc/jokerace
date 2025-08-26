import { ChartDataPoint } from "../types";
import { scaleLinear, scalePoint } from "@visx/scale";
import { ScaleLinear, ScalePoint } from "d3-scale";
import moment from "moment";

export const findDataPointByPrice = (data: ChartDataPoint[], targetPrice: number) => {
  const index = data.findIndex(item => Math.abs(item.pv - targetPrice) < 0.0001);
  return { index, point: data[index] || data[0] };
};

export const createXScale = (data: ChartDataPoint[], innerWidth: number): ScalePoint<string> => {
  return scalePoint({
    range: [0, innerWidth],
    domain: data.map(d => d.id),
  });
};

export const createYScale = (data: ChartDataPoint[], chartHeight: number): ScaleLinear<number, number> => {
  const minValue = Math.min(...data.map(d => d.pv));
  const maxValue = Math.max(...data.map(d => d.pv));

  const range = maxValue - minValue;
  const padding = range * 0.05;

  return scaleLinear({
    range: [chartHeight, 0],
    domain: [minValue - padding, maxValue + padding],
  });
};

export const createAccessors = (xScale: ScalePoint<string>, yScale: ScaleLinear<number, number>) => {
  const getX = (d: ChartDataPoint) => xScale(d.id) ?? 0;
  const getY = (d: ChartDataPoint) => yScale(d.pv) ?? 0;

  return { getX, getY };
};

export const createScalesAndAccessors = (data: ChartDataPoint[], innerWidth: number, chartHeight: number) => {
  const xScale = createXScale(data, innerWidth);
  const yScale = createYScale(data, chartHeight);
  const { getX, getY } = createAccessors(xScale, yScale);

  return {
    xScale,
    yScale,
    getX,
    getY,
  };
};

export const formatDateParts = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();
  return { monthDay, time };
};

export const formatDateWithBoldMonthDay = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();
  return `${monthDay}, ${time}`;
};
