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
  const [minY, maxY] = yScale.domain();
  const horizontalGridCount = 6;
  const horizontalGridTicks = Array.from(
    { length: horizontalGridCount + 1 },
    (_, i) => minY + (maxY - minY) * (i / horizontalGridCount),
  );

  const openHorizontalGridTicks = horizontalGridTicks.slice(0, -1);

  const horizontalGridLines = openHorizontalGridTicks.map((tick, i) => (
    <Line
      key={`h-grid-${i}`}
      from={{ x: 0, y: yScale(tick) }}
      to={{ x: innerWidth, y: yScale(tick) }}
      stroke={CHART_CONFIG.colors.grid}
      strokeWidth={0.5}
      width={95}
      height={95}
    />
  ));

  const verticalGridSpacing = innerWidth / CHART_CONFIG.verticalGridSections;
  const verticalGridLines = Array.from({ length: CHART_CONFIG.verticalGridSections + 1 }, (_, i) => {
    const isLastLine = i === CHART_CONFIG.verticalGridSections;
    const lineHeight = isLastLine ? innerHeight + 15 : innerHeight;

    return (
      <Line
        key={`v-grid-${i}`}
        from={{ x: i * verticalGridSpacing, y: 0 }}
        to={{ x: i * verticalGridSpacing, y: lineHeight }}
        stroke={CHART_CONFIG.colors.grid}
        strokeWidth={0.5}
        width={95}
        height={95}
      />
    );
  });

  return (
    <>
      {horizontalGridLines}
      {verticalGridLines}
    </>
  );
};

export default ChartGrid;
