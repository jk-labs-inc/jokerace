export const validateCostToPropose = (value: number | null, minCostToPropose: number): string | null => {
  if (value === null || value < minCostToPropose) {
    return `must be at least ${minCostToPropose}`;
  }
  return null;
};

export const validateCostToVote = (value: number | null, minCostToVote: number): string | null => {
  if (value === null || value < minCostToVote) {
    return `must be at least ${minCostToVote}`;
  }
  return null;
};

export const validateStartAndEndPrice = (start: number | null, end: number | null): string | null => {
  if (start === null || end === null || end <= start) {
    return "finish price must be greater than start price";
  }
  return null;
};
