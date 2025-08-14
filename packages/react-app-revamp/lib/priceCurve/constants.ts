/**
 * Threshold below which percentage increase is considered negligible
 * Set to 0.1% since anything below this rounds to 0.0% when displayed with 1 decimal place
 */
export const PERCENTAGE_INCREASE_THRESHOLD = 0.1;

/**
 * Precision for price comparison (6 decimal places)
 * Used to determine if price changes are significant enough to include
 */
export const PRICE_PRECISION = 1e6;
