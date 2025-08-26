// Calculate which dates to show based on hover state
export const getTickValues = (
  hoveredIndex: number | null,
  data: Array<{ id: string; date: string }>,
  firstId: string,
  lastId: string,
) => {
  if (hoveredIndex === null || hoveredIndex < 0 || hoveredIndex >= data.length) {
    // No hover - show start and end dates
    return [firstId, lastId].filter(Boolean);
  }

  const hoveredDataPoint = data[hoveredIndex];
  if (!hoveredDataPoint) {
    return [firstId, lastId].filter(Boolean);
  }

  const totalDataPoints = data.length;
  const proximityThreshold = Math.max(1, Math.floor(totalDataPoints * 0.2)); // 15% of data points as threshold

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
