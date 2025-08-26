import BigNumber from "bignumber.js";
import { formatNumberAbbreviated } from "./formatNumber";

const MIN_VALUE_FOR_ABBREVIATION = 1000;

export function formatBalance(balance: string): string {
  const num = new BigNumber(balance);

  // handle zero
  if (num.isZero()) {
    return "0";
  }

  // handle small numbers (less than 0.001)
  if (num.abs().isLessThan(0.001)) {
    // For small numbers, use 6 decimal places
    return num.decimalPlaces(6, BigNumber.ROUND_HALF_UP).toString();
  }

  // handle numbers >= 0.001
  const truncated = num.decimalPlaces(5, BigNumber.ROUND_HALF_UP);

  // use abbreviated format for numbers >= 1000
  if (truncated.abs().isGreaterThanOrEqualTo(MIN_VALUE_FOR_ABBREVIATION)) {
    return formatNumberAbbreviated(truncated.toNumber());
  }

  return truncated.toString();
}
