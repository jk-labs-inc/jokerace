import React from "react";
import { AxisRight as VisxAxisRight } from "@visx/axis";
import { ScaleLinear } from "d3-scale";
import { formatBalance } from "@helpers/formatBalance";
import { formatEther, parseEther } from "viem";

interface AxisRightProps {
  yScale: ScaleLinear<number, number>;
  chartWidth: number;
  visibleTicks: number[];
  currentPrice: number;
  hoveredPrice: number | null;
}

const AxisRight: React.FC<AxisRightProps> = ({ yScale, chartWidth, visibleTicks, currentPrice, hoveredPrice }) => {
  return (
    <g>
      <VisxAxisRight
        scale={yScale}
        left={chartWidth}
        tickValues={visibleTicks}
        tickFormat={(value: { toString: () => string }) => {
          const priceInWei = parseEther(value.toString());
          const formattedEther = formatEther(priceInWei);
          return `${formatBalance(formattedEther)} eth`;
        }}
        tickLabelProps={value => {
          const isCurrentPrice = value === currentPrice;
          const isHoveredPrice = hoveredPrice !== null && value === hoveredPrice;

          return {
            fill: "#ffffff",
            fontSize: 12,
            textAnchor: "start",
            dy: "0.33em",
            dx: 8,
          };
        }}
        tickStroke="transparent"
        stroke="transparent"
      />

      {/* Custom styled backgrounds for current and hovered prices */}
      {visibleTicks.map(tick => {
        const isCurrentPrice = tick === currentPrice;
        const isHoveredPrice = hoveredPrice !== null && tick === hoveredPrice;

        if (!isCurrentPrice && !isHoveredPrice) return null;

        const yPos = yScale(tick);
        const priceInWei = parseEther(tick.toString());
        const formattedEther = formatEther(priceInWei);
        const formattedPrice = `${formatBalance(formattedEther)} eth`;

        return (
          <g key={`styled-tick-${tick}`}>
            {/* Background rectangle */}
            <rect
              x={chartWidth + 8}
              y={yPos - 12}
              width={120}
              height={24}
              rx={8}
              fill={isHoveredPrice ? "#404040" : isCurrentPrice ? "#22d3ee" : "transparent"}
            />
            {/* Text overlay */}
            <text
              x={chartWidth + 16}
              y={yPos}
              fill={isHoveredPrice ? "#ffffff" : isCurrentPrice ? "#000000" : "#6b7280"}
              fontSize={12}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {formattedPrice}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default AxisRight;
