import { PERCENTAGE_INCREASE_THRESHOLD, PRICE_PRECISION } from "./constants";
import { ExponentialPricingInput, GeneratePricePointsParams, PricePoint, PricePointInternal } from "./types";
import { formatEther } from "viem";
import { formatBalance } from "@helpers/formatBalance";

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

  return BigInt(Math.round(endPrice));
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

/**
 * Generates all price points for a contest based on the exponential curve
 * This is a generic function that can be used for charts, calculations, or any other purpose
 * @param params - Configuration for price point generation
 * @returns Array of price points with dates and formatted prices, optimized to exclude negligible changes
 */
export const generatePricePoints = (params: GeneratePricePointsParams): PricePoint[] => {
  const { startPrice, multiple, startTime, endTime, updateIntervalSeconds = 60 } = params;

  // Validate inputs
  if (startPrice <= 0) {
    throw new Error("Start price must be greater than 0");
  }

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  if (updateIntervalSeconds <= 0) {
    throw new Error("Update interval must be greater than 0");
  }

  // Calculate total duration in seconds
  const totalDurationMs = endTime.getTime() - startTime.getTime();
  const totalDurationSeconds = Math.floor(totalDurationMs / 1000);

  if (totalDurationSeconds <= 0) {
    throw new Error("Duration must be greater than 0 seconds");
  }

  const pricePoints: PricePointInternal[] = [];
  let lastSignificantPrice = BigInt(0);

  // Convert startPrice to bigint (assuming it's in wei)
  const startPriceBigInt = BigInt(Math.round(startPrice));

  // Always include the start point
  pricePoints.push({
    date: startTime,
    priceBigInt: startPriceBigInt,
  });
  lastSignificantPrice = startPriceBigInt;

  // Threshold for 6 decimal places in ETH (1 wei = 1e-18 ETH, so 6 decimals = 1e-12 ETH = 1e12 wei)
  const PRECISION_THRESHOLD = BigInt(1e12);

  // Generate intermediate points at each update interval
  for (let seconds = updateIntervalSeconds; seconds < totalDurationSeconds; seconds += updateIntervalSeconds) {
    // Calculate percentage through the total period (0-100%)
    const percentThrough = (seconds / totalDurationSeconds) * 100;

    // Calculate price using exponential formula: y = startPrice * 2^(multiple * percentThrough)
    const priceFloat = startPrice * Math.pow(2, multiple * percentThrough);
    const priceBigInt = BigInt(Math.round(priceFloat));

    // Only add point if price has changed significantly (more than 6 decimal places)
    const priceDifference =
      priceBigInt > lastSignificantPrice ? priceBigInt - lastSignificantPrice : lastSignificantPrice - priceBigInt;

    if (priceDifference >= PRECISION_THRESHOLD) {
      // Fix: Subtract updateIntervalSeconds to align with when price becomes active
      const pointDate = new Date(startTime.getTime() + (seconds - updateIntervalSeconds) * 1000);

      pricePoints.push({
        date: pointDate,
        priceBigInt,
      });
      lastSignificantPrice = priceBigInt;
    }
  }

  // Always include the end point
  const endPriceFloat = startPrice * Math.pow(2, multiple * 100);
  const endPriceBigInt = BigInt(Math.round(endPriceFloat));

  // Only add end point if it's significantly different from the last point
  const endPriceDifference =
    endPriceBigInt > lastSignificantPrice
      ? endPriceBigInt - lastSignificantPrice
      : lastSignificantPrice - endPriceBigInt;

  if (pricePoints.length === 1 || endPriceDifference >= PRECISION_THRESHOLD) {
    pricePoints.push({
      date: endTime,
      priceBigInt: endPriceBigInt,
    });
  }

  // Format all prices at the end
  const formattedPricePoints: PricePoint[] = pricePoints.map(point => ({
    date: point.date.toISOString(),
    price: formatEther(point.priceBigInt),
  }));

  return formattedPricePoints;
};
