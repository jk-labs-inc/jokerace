import React from "react";
import { CHART_CONFIG } from "../../constants";

interface AnimatedDotProps {
  x: number;
  y: number;
  isHovered: boolean;
}

const AnimatedDot: React.FC<AnimatedDotProps> = ({ x, y, isHovered }) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={6}
      fill={CHART_CONFIG.colors.activeDot}
      stroke={CHART_CONFIG.colors.activeDot}
      strokeWidth={2}
      style={{
        filter: "drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        transformOrigin: `${x}px ${y}px`,
      }}
    />
  );
};

export default AnimatedDot;
