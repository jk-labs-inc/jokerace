/**
 * Converts a number to a more human-readable string format
 * @param num - The number to format
 * @return A string representing the formatted number
 */
export function formatNumber(num: number, decimal = 0): string {
  let formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: decimal });

  let formatted = formatter.format(+num.toFixed(decimal));

  return formatted;
}
