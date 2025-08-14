export const MARGIN = { top: 20, right: 90, left: 0, bottom: 40 }; // Increased bottom margin for X-axis

export const CHART_CONFIG = {
  verticalGridSections: 8,
  xAxisHeight: 30, // Height reserved for X-axis labels
  colors: {
    grid: "#3D3D3D",
    border: "#ffffff",
    mainLine: "#BB65FF",
    activeDot: "#22d3ee",
    hoverLine: "#ffffff",
  },
  animation: {
    dot: {
      stiffness: 300,
      damping: 35,
    },
    referenceLines: {
      stiffness: 250,
      damping: 30,
    },
    dotScale: {
      stiffness: 400,
      damping: 25,
    },
  },
} as const;
