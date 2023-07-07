/**
 * Converts a number to a more human-readable string format
 * @param num - The number to format
 * @param decimals - Optional parameter to determine the number of decimal places
 * @return A string representing the formatted number
 */
export function formatNumber(num: number, decimals: number = 1): string {
  let suffix = "";
  let scaledNumber = num;

  if (num >= 1e9) {
    scaledNumber = num / 1e9;
    suffix = "B";
  } else if (num >= 1e6) {
    scaledNumber = num / 1e6;
    suffix = "M";
  } else if (num >= 1e3) {
    scaledNumber = num / 1e3;
    suffix = "K";
  }

  let result = scaledNumber.toFixed(decimals);
  result = parseFloat(result).toString();

  return result + suffix;
}
