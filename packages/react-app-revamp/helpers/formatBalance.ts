import BigNumber from "bignumber.js";

const MIN_VALUE_FOR_COMMA_SEPARATION = 1000;

export function formatBalance(balance: string): string {
  const num = new BigNumber(balance);

  // handle zero
  if (num.isZero()) {
    return "0";
  }

  // handle small numbers (less than 0.001)
  if (num.abs().isLessThan(0.001)) {
    // find the first non-zero digit
    const firstNonZeroIndex = balance.replace(/^-?0\.?0*/, "").search(/[1-9]/);
    if (firstNonZeroIndex !== -1) {
      // return the number with up to 5 significant digits
      return num.precision(firstNonZeroIndex + 5).toString();
    }
  }

  // handle numbers >= 0.001
  const truncated = num.decimalPlaces(5, BigNumber.ROUND_HALF_UP);

  // add comma separators only for numbers >= 1000
  if (truncated.abs().isGreaterThanOrEqualTo(MIN_VALUE_FOR_COMMA_SEPARATION)) {
    return truncated.toFormat();
  }

  return truncated.toString();
}
