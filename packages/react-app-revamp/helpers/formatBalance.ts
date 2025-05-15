import BigNumber from "bignumber.js";

const MIN_VALUE_FOR_COMMA_SEPARATION = 1000;

// TODO: check if this function is working as expected
export function formatBalance(balance: string): number {
  const num = new BigNumber(balance);

  // handle zero
  if (num.isZero()) {
    return 0;
  }

  // handle small numbers (less than 0.001)
  if (num.abs().isLessThan(0.001)) {
    // find the first non-zero digit
    const firstNonZeroIndex = balance.replace(/^-?0\.?0*/, "").search(/[1-9]/);
    if (firstNonZeroIndex !== -1) {
      // return the number with up to 3 significant digits
      return num.precision(firstNonZeroIndex + 3).toNumber();
    }
  }

  // handle numbers >= 0.001
  const truncated = num.decimalPlaces(3, BigNumber.ROUND_FLOOR);

  // no special formatting needed for numbers, just return the value
  return truncated.toNumber();
}
