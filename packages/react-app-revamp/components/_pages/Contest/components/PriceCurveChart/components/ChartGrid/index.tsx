import { Line } from "@visx/shape";
import { ScaleLinear } from "d3-scale";
import React from "react";
import { CHART_CONFIG } from "../../constants";

interface ChartGridProps {
  innerWidth: number;
  innerHeight: number;
  yAxisTicks: number[];
  yScale: ScaleLinear<number, number>;
}

const ChartGrid: React.FC<ChartGridProps> = ({ innerWidth, innerHeight, yAxisTicks, yScale }) => {
  // Create horizontal grid lines (filter out top line)
  const horizontalGridLines = yAxisTicks
    .filter(tick => yScale(tick) > 0)
    .map(tick => (
      <Line
        key={`h-grid-${tick}`}
        from={{ x: 0, y: yScale(tick) }}
        to={{ x: innerWidth, y: yScale(tick) }}
        stroke={CHART_CONFIG.colors.grid}
        strokeWidth={1}
      />
    ));

  // Create vertical grid lines
  const verticalGridSpacing = innerWidth / CHART_CONFIG.verticalGridSections;
  const verticalGridLines = Array.from({ length: CHART_CONFIG.verticalGridSections + 1 }, (_, i) => (
    <Line
      key={`v-grid-${i}`}
      from={{ x: i * verticalGridSpacing, y: 0 }}
      to={{ x: i * verticalGridSpacing, y: innerHeight }}
      stroke={CHART_CONFIG.colors.grid}
      strokeWidth={1}
    />
  ));

  return (
    <>
      {horizontalGridLines}
      {verticalGridLines}
    </>
  );
};

export default ChartGrid;
