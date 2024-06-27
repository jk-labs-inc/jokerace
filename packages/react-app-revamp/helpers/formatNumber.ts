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

/**
 * Converts a number to a more human-readable string format with abbreviations
 * @param num - The number to format
 * @return A string representing the formatted number
 */
export function formatNumberAbbreviated(num: number): string {
  const abbreviations = [
    { value: 1e9, symbol: "b" },
    { value: 1e6, symbol: "m" },
    { value: 1e3, symbol: "k" },
  ];

  if (num < 10000) {
    return num.toLocaleString("en-US");
  }

  for (const { value, symbol } of abbreviations) {
    if (num >= value) {
      const formatted = (num / value).toFixed(2).replace(/\.00$/, "");
      return `${formatted}${symbol}`;
    }
  }

  return num.toString();
}
