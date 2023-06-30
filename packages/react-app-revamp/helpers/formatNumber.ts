/**
 * Converts a number to a more human-readable string format with no decimal places
 * @param num - The number to format
 * @return A string representing the formatted number
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
