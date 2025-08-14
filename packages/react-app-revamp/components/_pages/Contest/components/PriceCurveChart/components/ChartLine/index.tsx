import { curveCardinal } from "@visx/curve";
import { Line, LinePath } from "@visx/shape";
import { ScaleLinear } from "d3-scale";
import React from "react";
import { CHART_CONFIG } from "../../constants";
import { ChartDataPoint } from "../../types";

interface ChartLineProps {
  data: ChartDataPoint[];
  getX: (d: ChartDataPoint) => number;
  getY: (d: ChartDataPoint) => number;
  currentPrice: number;
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
}

const ChartLine: React.FC<ChartLineProps> = ({ data, getX, getY, currentPrice, yScale, innerWidth }) => {
  return (
    <>
      <LinePath
        data={data}
        x={getX}
        y={getY}
        stroke={CHART_CONFIG.colors.mainLine}
        strokeWidth={3}
        curve={curveCardinal}
        fill="none"
      />

      <Line
        from={{ x: 0, y: yScale(currentPrice) }}
        to={{ x: innerWidth, y: yScale(currentPrice) }}
        stroke={CHART_CONFIG.colors.mainLine}
        strokeWidth={2}
        strokeDasharray="10,10"
      />
    </>
  );
};

export default ChartLine;
