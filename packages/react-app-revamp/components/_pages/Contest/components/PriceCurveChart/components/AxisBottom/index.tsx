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
  // Get first, last, and active dates
  const firstDate = data[0]?.date;
  const lastDate = data[data.length - 1]?.date;

  // Determine which dates to show
  const tickValues = [data[0]?.id, data[data.length - 1]?.id].filter(Boolean);

  return (
    <>
      {/* Static left and right dates */}
      <VisxAxisBottom
        scale={xScale}
        top={chartHeight + 20}
        tickValues={tickValues}
        tickFormat={value => {
          const dataPoint = data.find(d => d.id === value);
          if (!dataPoint) return "";

          if (dataPoint.id === data[0]?.id) {
            return formatDateWithBoldMonthDay(firstDate);
          }
          if (dataPoint.id === data[data.length - 1]?.id) {
            return formatDateWithBoldMonthDay(lastDate);
          }
          return "";
        }}
        tickLabelProps={() => ({
          fill: "#ffffff",
          fontSize: 12,
          textAnchor: "middle",
          dy: "0.33em",
        })}
        tickStroke="transparent"
        stroke="transparent"
      />

      {/* Active date overlay - we'll need to implement this separately since visx doesn't support dynamic positioning easily */}
    </>
  );
};

export default AxisBottom;
