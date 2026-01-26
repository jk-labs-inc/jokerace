import { BEZIER_POINTS } from "./constants";

const { P0, P1, P2, P3 } = BEZIER_POINTS;

export const getBezierPoint = (t: number) => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * P0.x + 3 * mt2 * t * P1.x + 3 * mt * t2 * P2.x + t3 * P3.x,
    y: mt3 * P0.y + 3 * mt2 * t * P1.y + 3 * mt * t2 * P2.y + t3 * P3.y,
  };
};

export const createScaledPath = (scaleX: number, scaleY: number): string => {
  return `M${P0.x * scaleX} ${P0.y * scaleY}C${P1.x * scaleX} ${P1.y * scaleY} ${P2.x * scaleX} ${P2.y * scaleY} ${P3.x * scaleX} ${P3.y * scaleY}`;
};
