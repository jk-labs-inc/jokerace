/**
 * Converts a number to a more human-readable string format
 * @param num - The number to format
 * @return A string representing the formatted number
 */
export function formatNumber(num: number): string {
  let formatter = new Intl.NumberFormat("en-US");

  let formatted = formatter.format(+num);

  return formatted;
}
