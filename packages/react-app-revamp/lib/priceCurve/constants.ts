/**
 * Threshold below which percentage increase is considered negligible
 * Set to 0.1% since anything below this rounds to 0.0% when displayed with 1 decimal place
 */
export const PERCENTAGE_INCREASE_THRESHOLD = 0.1;

export const COST_ROUNDING_VALUE = 1e12; // Matches smart contract COST_ROUNDING_VALUE
