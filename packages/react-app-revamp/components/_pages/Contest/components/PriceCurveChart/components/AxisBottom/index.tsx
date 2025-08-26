import React from "react";
import { AxisBottom as VisxAxisBottom } from "@visx/axis";
import { ScalePoint } from "d3-scale";
import moment from "moment";
import { getTickValues } from "./utils";

interface AxisBottomProps {
  xScale: ScalePoint<string>;
  chartHeight: number;
  data: Array<{ id: string; date: string }>;
  activeDate: string;
  hoveredIndex: number | null;
}

const formatDateWithBoldMonthDay = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();
  return `${monthDay}, ${time}`;
};

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
    let dx = 0; // Default horizontal offset

    if (isFirstDate && !isHoveredPoint) {
      // Start date should be positioned slightly to the right (per figma)
      textAnchor = "middle";
      dx = 14;
    } else if (isLastDate && !isHoveredPoint) {
      // End date should be center-aligned to align with the grid line
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
        tickStroke="transparent"
        stroke="transparent"
      />
    </>
  );
};

export default AxisBottom;
