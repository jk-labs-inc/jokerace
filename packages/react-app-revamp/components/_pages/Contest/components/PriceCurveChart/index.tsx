import React, { useState } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scalePoint } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { localPoint } from "@visx/event";
import ChartGrid from "./components/ChartGrid";
import ChartBorders from "./components/ChartBorders";
import ChartLine from "./components/ChartLine";
import AnimatedDot from "./components/AnimatedDot";
import ReferenceLines from "./components/ReferenceLines";
import InternalXAxis from "./components/InternalXAxis";
import PriceCurveChartCustomYAxis from "./components/CustomYAxis";
import { useChartData } from "./hooks/useChartData";
import { MARGIN, CHART_CONFIG } from "./constants";
import { PriceCurveChartProps } from "./types";

const PriceCurveChart: React.FC<PriceCurveChartProps> = ({ data = [], currentPrice = 0 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useChartData({ data, currentPrice, hoveredIndex });

  const Chart = ({ width, height }: { width: number; height: number }) => {
    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
    const totalInnerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

    // Reserve space for X-axis below the chart
    const chartHeight = totalInnerHeight - CHART_CONFIG.xAxisHeight;
    const xAxisY = chartHeight + 20; // Position X-axis 20px below the chart

    // Don't render if dimensions are too small
    if (innerWidth <= 0 || totalInnerHeight <= 0 || data.length === 0) {
      return <div>Chart too small to render</div>;
    }

    // Create scales (use chartHeight, not totalInnerHeight)
    const xScale = scalePoint({
      range: [0, innerWidth],
      domain: data.map(d => d.id),
    });

    const yScale = scaleLinear({
      range: [chartHeight, 0], // Use chartHeight instead of totalInnerHeight
      domain: [Math.min(...data.map(d => d.pv)), Math.max(...data.map(d => d.pv))],
    });

    // Accessor functions
    const getX = (d: (typeof data)[0]) => xScale(d.id) ?? 0;
    const getY = (d: (typeof data)[0]) => yScale(d.pv) ?? 0;

    // Calculate positions directly (no more Motion values)
    const dotX = chartData.active.point ? getX(chartData.active.point) : 0;
    const dotY = yScale(chartData.active.price);
    const refLineY = yScale(chartData.active.price);
    const refLineX = chartData.active.point ? getX(chartData.active.point) : 0;

    // Event handlers
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
      <div className="relative w-full h-full">
        <svg width={width} height={height}>
          <Group left={MARGIN.left} top={MARGIN.top}>
            <ChartGrid
              innerWidth={innerWidth}
              innerHeight={chartHeight}
              yAxisTicks={chartData.yAxisTicks}
              yScale={yScale}
            />

            <ChartBorders innerWidth={innerWidth} innerHeight={chartHeight} />

            <ChartLine
              data={data}
              getX={getX}
              getY={getY}
              currentPrice={currentPrice}
              yScale={yScale}
              innerWidth={innerWidth}
            />

            {chartData.hovered.point && (
              <ReferenceLines
                x={refLineX}
                y={refLineY}
                innerWidth={innerWidth}
                innerHeight={chartHeight}
                showHorizontalLine={chartData.hovered.price !== currentPrice}
              />
            )}

            {chartData.active.point && <AnimatedDot x={dotX} y={dotY} isHovered={!!chartData.hovered.point} />}

            <InternalXAxis
              firstDate={chartData.dates.first}
              activeDate={chartData.dates.active}
              lastDate={chartData.dates.last}
              innerWidth={innerWidth}
              yPosition={xAxisY}
            />

            <rect
              width={innerWidth}
              height={chartHeight}
              fill="transparent"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "crosshair" }}
            />
          </Group>
        </svg>

        <div
          className="absolute top-0 right-0"
          style={{
            paddingTop: MARGIN.top,
            height: chartHeight + MARGIN.top,
            width: MARGIN.right - 10,
          }}
        >
          {chartData.yAxisTicks.map(tick => {
            const yPosition = yScale(tick);
            const isCurrentPrice = tick === currentPrice;
            const isHoveredPrice =
              chartData.hovered.price !== null && tick === chartData.hovered.price && !isCurrentPrice;

            return (
              <PriceCurveChartCustomYAxis
                key={`y-tick-${tick}`}
                price={tick}
                yPosition={yPosition}
                totalHeight={chartHeight}
                isCurrentPrice={isCurrentPrice}
                isHoveredPrice={isHoveredPrice}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[500px] flex flex-col">
      <div className="flex-1">
        <ParentSize>{({ width, height }) => <Chart width={width} height={height} />}</ParentSize>
      </div>
    </div>
  );
};

export default PriceCurveChart;
