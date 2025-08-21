import React, { useState } from "react";
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import ChartGrid from "./components/ChartGrid";
import ChartBorders from "./components/ChartBorders";
import ChartLine from "./components/ChartLine";
import AnimatedDot from "./components/AnimatedDot";
import ReferenceLines from "./components/ReferenceLines";
import AxisRight from "./components/AxisRight";
import AxisBottom from "./components/AxisBottom";
import { useChartData } from "./hooks/useChartData";
import { MARGIN } from "./constants";
import { PriceCurveChartProps } from "./types";
import { createScalesAndAccessors } from "./helpers";

export type PriceCurveChartComponentProps = PriceCurveChartProps & {
  width: number;
  height: number;
};

const PriceCurveChart: React.FC<PriceCurveChartComponentProps> = ({
  data = [],
  currentPrice = 0,
  width,
  height = 500,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartData = useChartData({ data, currentPrice, hoveredIndex });

  const chartWidth = width - MARGIN.left - MARGIN.right;
  const chartHeight = height - MARGIN.top - MARGIN.bottom;

  if (chartWidth <= 0 || chartHeight <= 0 || data.length === 0) {
    return null;
  }

  const { xScale, yScale, getX, getY } = createScalesAndAccessors(data, chartWidth, chartHeight);

  const dotX = chartData.active.point ? getX(chartData.active.point) : 0;
  const dotY = yScale(chartData.active.price);
  const refLineX = chartData.active.point ? getX(chartData.active.point) : 0;
  const refLineY = yScale(chartData.active.price);

  const visibleTicks = chartData.yAxisTicks.filter(tick => {
    const isCurrentPrice = tick === currentPrice;
    const isHoveredPrice = chartData.hovered.price !== null && tick === chartData.hovered.price;
    return isCurrentPrice || isHoveredPrice;
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    const point = localPoint(event);
    if (!point) return;

    const x = point.x - MARGIN.left;
    const closestIndex = data.reduce((closest, d, i) => {
      const currentX = getX(d);
      const closestX = getX(data[closest]);
      return Math.abs(currentX - x) < Math.abs(closestX - x) ? i : closest;
    }, 0);

    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <>
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <ChartGrid
            innerWidth={chartWidth}
            innerHeight={chartHeight}
            yAxisTicks={chartData.yAxisTicks}
            yScale={yScale}
          />

          <ChartBorders innerWidth={chartWidth} innerHeight={chartHeight} />

          <ChartLine
            data={data}
            getX={getX}
            getY={getY}
            currentPrice={currentPrice}
            yScale={yScale}
            innerWidth={chartWidth}
          />

          {chartData.hovered.point && (
            <ReferenceLines
              x={refLineX}
              y={refLineY}
              innerWidth={chartWidth}
              innerHeight={chartHeight}
              showHorizontalLine={chartData.hovered.price !== currentPrice}
            />
          )}

          {chartData.active.point && <AnimatedDot x={dotX} y={dotY} isHovered={!!chartData.hovered.point} />}

          <AxisRight
            yScale={yScale}
            chartWidth={chartWidth}
            visibleTicks={visibleTicks}
            currentPrice={currentPrice}
            hoveredPrice={chartData.hovered.price}
          />

          <AxisBottom
            xScale={xScale}
            chartHeight={chartHeight}
            data={data}
            activeDate={chartData.dates.active}
            hoveredIndex={hoveredIndex}
          />

          <rect
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          />
        </Group>
      </svg>
    </>
  );
};

export default PriceCurveChart;
