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
