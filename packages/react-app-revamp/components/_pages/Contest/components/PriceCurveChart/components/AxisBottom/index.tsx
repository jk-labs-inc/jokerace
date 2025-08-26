import { AxisBottom as VisxAxisBottom } from "@visx/axis";
import { ScalePoint } from "d3-scale";
import React from "react";
import { formatDateParts, formatDateWithBoldMonthDay } from "../../helpers";
import { getTickValues } from "./utils";

interface AxisBottomProps {
  xScale: ScalePoint<string>;
  chartHeight: number;
  data: Array<{ id: string; date: string }>;
  activeDate: string;
  hoveredIndex: number | null;
}

const AxisBottom: React.FC<AxisBottomProps> = ({ xScale, chartHeight, data, activeDate, hoveredIndex }) => {
  const firstId = data[0]?.id;
  const lastId = data[data.length - 1]?.id;
  const tickValues = getTickValues(hoveredIndex, data, firstId, lastId);

  const getTickFormat = (value: string) => {
    const dataPoint = data.find(d => d.id === value);
    if (!dataPoint) return "";

    return formatDateWithBoldMonthDay(dataPoint.date);
  };

  const getTickLabelProps = (value: string) => {
    const isFirstDate = value === firstId;
    const isLastDate = value === lastId;
    const isHoveredPoint = hoveredIndex !== null && data[hoveredIndex]?.id === value;

    let textAnchor: "start" | "middle" | "end" = "middle";
    let dx = 0;

    if (isFirstDate && !isHoveredPoint) {
      textAnchor = "middle";
      dx = 14;
    } else if (isLastDate && !isHoveredPoint) {
      textAnchor = "middle";
    }

    return {
      fill: "#ffffff",
      fontSize: 12,
      textAnchor,
      dy: "0.33em",
      dx,
    };
  };

  const CustomTickComponent = ({ formattedValue, ...textProps }: any) => {
    const dataPoint = data.find(d => {
      const x = xScale(d.id);
      return Math.abs((x ?? 0) - textProps.x) < 1;
    });

    if (!dataPoint) {
      return <text {...textProps}>{formattedValue}</text>;
    }

    const { monthDay, time } = formatDateParts(dataPoint.date);

    return (
      <text {...textProps}>
        <tspan fontWeight="bold">{monthDay}</tspan>
        <tspan fontWeight="normal">, {time}</tspan>
      </text>
    );
  };

  return (
    <>
      {/* Custom background for active date - render behind the axis */}
      {hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < data.length && (
        <g>
          <rect
            x={(xScale(data[hoveredIndex].id) ?? 0) - 60}
            y={chartHeight + 18}
            width={120}
            height={24}
            rx={8}
            ry={8}
            fill="#212121"
          />
        </g>
      )}
      <VisxAxisBottom
        scale={xScale}
        top={chartHeight + 10}
        tickValues={tickValues}
        tickFormat={getTickFormat}
        tickLabelProps={getTickLabelProps}
        tickComponent={CustomTickComponent}
        tickStroke="transparent"
        stroke="transparent"
      />
    </>
  );
};

export default AxisBottom;
