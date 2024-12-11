import BigNumber from "bignumber.js";

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
      // return the number with up to 3 significant digits
      return num.precision(firstNonZeroIndex + 3).toString();
    }
  }

  // handle numbers >= 0.001
  const truncated = num.decimalPlaces(3, BigNumber.ROUND_FLOOR);

  // add comma separators only for numbers >= 1000
  if (truncated.abs().isGreaterThanOrEqualTo(1000)) {
    return truncated.toFormat();
  }

  return truncated.toString();
}
