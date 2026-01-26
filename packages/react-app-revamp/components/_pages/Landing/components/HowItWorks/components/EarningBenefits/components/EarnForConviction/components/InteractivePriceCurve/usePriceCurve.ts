import { useMemo } from "react";
import { CHART_SIZE, DOT_POSITION_T, MARGIN, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from "./constants";
import { createScaledPath, getBezierPoint } from "./utils";

export const usePriceCurve = () => {
  const innerWidth = CHART_SIZE - MARGIN.left - MARGIN.right;
  const innerHeight = CHART_SIZE - MARGIN.top - MARGIN.bottom;

  const scaleX = innerWidth / ORIGINAL_WIDTH;
  const scaleY = innerHeight / ORIGINAL_HEIGHT;

  const scaledPath = useMemo(() => createScaledPath(scaleX, scaleY), [scaleX, scaleY]);

  const dotPosition = useMemo(() => {
    const point = getBezierPoint(DOT_POSITION_T);
    return {
      x: point.x * scaleX,
      y: point.y * scaleY,
    };
  }, [scaleX, scaleY]);

  return {
    scaledPath,
    dotPosition,
    chartSize: CHART_SIZE,
    margin: MARGIN,
  };
};
