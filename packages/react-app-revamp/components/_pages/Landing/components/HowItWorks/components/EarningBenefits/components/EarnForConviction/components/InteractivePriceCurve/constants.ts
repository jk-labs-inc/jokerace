export const CHART_SIZE = 176; // w-44 = 11rem = 176px

export const MARGIN = {
  top: 28,
  right: 24,
  bottom: 28,
  left: 24,
} as const;

export const ORIGINAL_WIDTH = 98;
export const ORIGINAL_HEIGHT = 115;

// Bezier curve control points from Figma SVG (we use same values as in figma)
export const BEZIER_POINTS = {
  P0: { x: 1.23577, y: 112.52 },
  P1: { x: 1.23577, y: 112.52 },
  P2: { x: 95.9234, y: 122.317 },
  P3: { x: 95.9233, y: 1.72472 },
} as const;

export const DOT_POSITION_T = 0.9;
