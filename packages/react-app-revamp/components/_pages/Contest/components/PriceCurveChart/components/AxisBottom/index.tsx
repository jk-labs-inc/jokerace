import React from "react";
import { AxisBottom as VisxAxisBottom } from "@visx/axis";
import { ScalePoint } from "d3-scale";
import moment from "moment";

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

  // Calculate which dates to show based on hover state
  const getTickValues = () => {
    if (hoveredIndex === null || hoveredIndex < 0 || hoveredIndex >= data.length) {
      // No hover - show start and end dates
      return [firstId, lastId].filter(Boolean);
    }

    const hoveredDataPoint = data[hoveredIndex];
    if (!hoveredDataPoint) {
      return [firstId, lastId].filter(Boolean);
    }

    const totalDataPoints = data.length;
    const proximityThreshold = Math.max(1, Math.floor(totalDataPoints * 0.15)); // 15% of data points as threshold

    // Check if hovered point is close to start or end
    const isNearStart = hoveredIndex <= proximityThreshold;
    const isNearEnd = hoveredIndex >= totalDataPoints - proximityThreshold - 1;

    if (isNearStart && isNearEnd) {
      // Very small dataset - just show the hovered point
      return [hoveredDataPoint.id];
    } else if (isNearStart) {
      // Near start - show hovered point and end date
      return [hoveredDataPoint.id, lastId].filter(Boolean);
    } else if (isNearEnd) {
      // Near end - show start date and hovered point
      return [firstId, hoveredDataPoint.id].filter(Boolean);
    } else {
      // In middle - show start, hovered, and end dates
      return [firstId, hoveredDataPoint.id, lastId].filter(Boolean);
    }
  };

  const tickValues = getTickValues();

  const getTickFormat = (value: string) => {
    const dataPoint = data.find(d => d.id === value);
    if (!dataPoint) return "";

    // Always format the date the same way
    return formatDateWithBoldMonthDay(dataPoint.date);
  };

  const getTickLabelProps = (value: string) => {
    const isFirstDate = value === firstId;
    const isLastDate = value === lastId;
    const isHoveredPoint = hoveredIndex !== null && data[hoveredIndex]?.id === value;

    let textAnchor: "start" | "middle" | "end" = "middle";

    if (isFirstDate && !isHoveredPoint) {
      // Start date should be center-aligned to align with the grid line
      textAnchor = "middle";
    } else if (isLastDate && !isHoveredPoint) {
      // End date should be center-aligned to align with the grid line
      textAnchor = "middle";
    }
    // Middle/hovered dates stay center-aligned

    return {
      fill: "#ffffff",
      fontSize: 12,
      textAnchor,
      dy: "0.33em",
    };
  };

  return (
    <>
      {/* Custom background for active date - render behind the axis */}
      {hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < data.length && (
        <g>
          <rect
            rx={8} // 8px radius as specified
            ry={8}
            fill="#212121" // Dark gray background as specified
            opacity={0.9}
          />
        </g>
      )}
      x
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
