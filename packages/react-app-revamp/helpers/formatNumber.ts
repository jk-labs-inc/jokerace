/**
 * Converts a number to a more human-readable string format
 * @param num - The number to format
 * @return A string representing the formatted number
 */
export function formatNumber(num: number): string {
  let suffix = "";
  let scaledNumber = num;
  let formattedNumber;

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

  // Only use toFixed(3) if the number is not an integer.
  if (Math.floor(scaledNumber) !== scaledNumber) {
    formattedNumber = scaledNumber.toFixed(3);
  } else {
    formattedNumber = scaledNumber.toString();
  }

  return formattedNumber + suffix;
}
