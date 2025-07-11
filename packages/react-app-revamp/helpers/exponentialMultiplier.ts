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
 * Calculates what the price will be at the next minute
 * @param costToVote - The current cost to vote (start price)
 * @param multiple - The exponential multiplier (c)
 * @param nextMinute - The next minute in the contest
 * @param totalMinutes - Total minutes in the contest
 * @returns The calculated price at the next minute
 */
export const calculateNextMinutePrice = (
  costToVote: number,
  multiple: number,
  nextMinute: number,
  totalMinutes: number,
): number => {
  if (costToVote <= 0) {
    throw new Error("Cost to vote must be greater than 0");
  }

  if (totalMinutes <= 0) {
    throw new Error("Total minutes must be greater than 0");
  }

  if (nextMinute < 0 || nextMinute > totalMinutes) {
    throw new Error("Next minute must be between 0 and total minutes");
  }

  // Formula: costToVote * 2^(c * (nextMinute / totalMinutes) * 100)
  const nextPrice = costToVote * Math.pow(2, multiple * (nextMinute / totalMinutes) * 100);

  return nextPrice;
};

/**
 * Calculates both the next minute's price and the percentage increase from current price
 * @param currentPrice - The current price
 * @param costToVote - The current cost to vote (start price)
 * @param multiple - The exponential multiplier (c)
 * @param currentMinute - The current minute in the contest
 * @param totalMinutes - Total minutes in the contest
 * @returns Object containing nextPrice, percentageIncrease, and isBelowThreshold
 */
export const calculateNextPriceAndIncrease = (
  currentPrice: number,
  costToVote: number,
  multiple: number,
  currentMinute: number,
  totalMinutes: number,
): { nextPrice: number; percentageIncrease: number; isBelowThreshold: boolean } => {
  if (currentPrice <= 0) {
    throw new Error("Current price must be greater than 0");
  }

  // Calculate next minute's price (currentMinute + 1)
  const nextMinute = currentMinute + 1;
  const nextPrice = calculateNextMinutePrice(costToVote, multiple, nextMinute, totalMinutes);

  const percentageIncrease = ((nextPrice - currentPrice) / currentPrice) * 100;

  const isBelowThreshold = percentageIncrease < PERCENTAGE_INCREASE_THRESHOLD;

  const percentageIncreaseRounded = Math.floor(percentageIncrease * 10) / 10;

  return {
    nextPrice,
    percentageIncrease: percentageIncreaseRounded,
    isBelowThreshold,
  };
};

/**
 * Calculates the next minute's price and percentage increase using contest store data
 * @param contestStore - The contest store containing timing data
 * @param currentPrice - The current price
 * @param costToVote - The current cost to vote (start price)
 * @param multiple - The exponential multiplier (c)
 * @returns Object containing nextPrice, percentageIncrease, and isBelowThreshold
 */
export const calculateNextPriceAndIncreaseFromStore = (
  contestStore: { getCurrentVotingMinute: () => number; getTotalVotingMinutes: () => number },
  currentPrice: number,
  costToVote: number,
  multiple: number,
): { nextPrice: number; percentageIncrease: number; isBelowThreshold: boolean } => {
  const currentMinute = contestStore.getCurrentVotingMinute();
  const totalMinutes = contestStore.getTotalVotingMinutes();

  return calculateNextPriceAndIncrease(currentPrice, costToVote, multiple, currentMinute, totalMinutes);
};
