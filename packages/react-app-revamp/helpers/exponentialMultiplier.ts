export interface ExponentialPricingInput {
  startPrice: number;
  endPrice: number;
}

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
