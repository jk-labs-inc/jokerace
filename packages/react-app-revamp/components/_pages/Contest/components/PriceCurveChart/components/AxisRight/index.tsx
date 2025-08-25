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
  currency  : string;
}

const AxisRight: React.FC<AxisRightProps> = ({
  yScale,
  chartWidth,
  visibleTicks,
  currentPrice,
  hoveredPrice,
  currency,
}) => {
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
        tickLabelProps={() => {
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
        if (!isCurrentPrice) return null;

        const yPos = yScale(tick);
        const priceInWei = parseEther(tick.toString());
        const formattedEther = formatEther(priceInWei);
        const formattedPrice = `${formatBalance(formattedEther)} ${currency}`;

        return (
          <g key={`current-tick-${tick}`}>
            {/* Current price background (always rendered) */}
            <rect x={chartWidth + 8} y={yPos - 14} width={90} height={24} rx={8} fill="#BB65FF" />
            <text
              x={chartWidth + 16}
              y={yPos}
              fill="#000000"
              fontSize={12}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {formattedPrice}
            </text>
          </g>
        );
      })}

      {hoveredPrice !== null &&
        hoveredPrice !== currentPrice &&
        visibleTicks.map(tick => {
          const isHoveredPrice = tick === hoveredPrice;
          if (!isHoveredPrice) return null;

          const yPos = yScale(tick);
          const priceInWei = parseEther(tick.toString());
          const formattedEther = formatEther(priceInWei);
          const formattedPrice = `${formatBalance(formattedEther)} eth`;

          return (
            <g key={`hovered-tick-${tick}`}>
              {/* Hovered price background (renders on top) */}
              <rect x={chartWidth + 8} y={yPos - 14} width={90} height={24} rx={8} fill="#212121" />
              <text
                x={chartWidth + 16}
                y={yPos}
                fill="#ffffff"
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
