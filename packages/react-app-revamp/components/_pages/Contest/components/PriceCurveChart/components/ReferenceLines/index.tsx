import React from "react";
import { Group } from "@visx/group";
import { CHART_CONFIG } from "../../constants";

interface ReferenceLinesProps {
  x: number;
  y: number;
  innerWidth: number;
  innerHeight: number;
  showHorizontalLine: boolean;
}

const ReferenceLines: React.FC<ReferenceLinesProps> = ({ x, y, innerWidth, innerHeight, showHorizontalLine }) => {
  return (
    <Group>
      {/* Horizontal line at hovered price */}
      {showHorizontalLine && (
        <line
          x1={0}
          x2={innerWidth}
          y1={y}
          y2={y}
          stroke={CHART_CONFIG.colors.hoverLine}
          strokeWidth={1}
          strokeDasharray="5,5"
          strokeOpacity={0.8}
        />
      )}

      {/* Vertical line at hovered point */}
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={innerHeight}
        stroke={CHART_CONFIG.colors.hoverLine}
        strokeWidth={1}
        strokeDasharray="5,5"
        strokeOpacity={0.8}
      />
    </Group>
  );
};

export default ReferenceLines;
