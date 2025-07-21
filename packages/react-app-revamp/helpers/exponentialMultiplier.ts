export interface ExponentialPricingInput {
  startPrice: number;
  endPrice: number;
}

/**
 * Threshold below which percentage increase is considered negligible
 * Set to 0.1% since anything below this rounds to 0.0% when displayed with 1 decimal place
 */
const PERCENTAGE_INCREASE_THRESHOLD = 0.1;

/**
 * Calculates the 'c' value for y = 2^(cx) formula
 * This 'c' becomes the 'multiple' parameter for smart contract deployment
 */
export const calculateExponentialMultiple = (input: ExponentialPricingInput): number => {
  const { startPrice, endPrice } = input;

  if (endPrice <= startPrice) {
    throw new Error("End price must be greater than start price");
  }

  // Calculate terminal multiple (what y should be at x=100)
  const terminalMultiple = endPrice / startPrice;

  const c = Math.log2(terminalMultiple) / 100;

  return c;
};

/**
 * Calculates the end price using the exponential formula: y = b * 2^(cx)
 * @param startPrice - The initial price (b)
 * @param multiple - The exponential multiplier (c)
 * @param x - The position on the curve (defaults to 100 for end price)
 * @returns The calculated end price (y)
 */
export const calculateEndPrice = (startPrice: number, multiple: number, x: number = 100): bigint => {
  if (startPrice <= 0) {
    throw new Error("Start price must be greater than 0");
  }

  // Formula: y = b * 2^(cx)
  const endPrice = startPrice * Math.pow(2, multiple * x);

  return BigInt(endPrice);
};

/**
 * Calculates the static minute-to-minute percentage increase for an exponential curve
 * Since the exponential curve has consistent rate of change, this only needs to be calculated once
 * @param costToVote - The current cost to vote (start price)
 * @param multiple - The exponential multiplier (c)
 * @param totalMinutes - Total minutes in the contest
 * @returns Object containing the static percentageIncrease and isBelowThreshold
 */
export const calculateStaticMinuteToMinutePercentage = (
  costToVote: number,
  multiple: number,
  totalMinutes: number,
): { percentageIncrease: number; isBelowThreshold: boolean } => {
  if (costToVote <= 0) {
    throw new Error("Cost to vote must be greater than 0");
  }

  if (totalMinutes <= 0) {
    throw new Error("Total minutes must be greater than 0");
  }

  // Calculate price at any minute (using minute 1 as example)
  const priceAtMinuteN = costToVote * Math.pow(2, multiple * (1 / totalMinutes) * 100);

  // Calculate price at next minute (minute 2)
  const priceAtMinuteNPlus1 = costToVote * Math.pow(2, multiple * (2 / totalMinutes) * 100);

  // Calculate percentage increase between consecutive minutes
  const percentageIncrease = ((priceAtMinuteNPlus1 - priceAtMinuteN) / priceAtMinuteN) * 100;

  const isBelowThreshold = percentageIncrease < PERCENTAGE_INCREASE_THRESHOLD;

  const percentageIncreaseRounded = Math.floor(percentageIncrease * 10) / 10;

  return {
    percentageIncrease: percentageIncreaseRounded,
    isBelowThreshold,
  };
};
