import React from "react";
import { Line } from "@visx/shape";
import { CHART_CONFIG } from "../../constants";

interface ChartBordersProps {
  innerWidth: number;
  innerHeight: number;
}

const ChartBorders: React.FC<ChartBordersProps> = ({ innerWidth, innerHeight }) => {
  return (
    <>
      <Line
        from={{ x: 0, y: 0 }}
        to={{ x: 0, y: innerHeight + 15 }}
        stroke={CHART_CONFIG.colors.border}
        strokeWidth={1}
      />

      {/* // TODO: check how can we assign negative x value on from */}
      <Line
        from={{ x: 0, y: innerHeight }}
        to={{ x: innerWidth, y: innerHeight }}
        stroke={CHART_CONFIG.colors.border}
        strokeWidth={1}
      />
    </>
  );
};

export default ChartBorders;
