export function formatBalance(balance: string): string {
  const num = parseFloat(balance);

  if (num === 0) {
    return "0";
  }

  // Check if the number is very small and if it is, display it up to the last significant digit
  if (num > 0 && num < 0.01) {
    // Find the position of the first non-zero digit after the decimal
    const afterDecimal = balance.split(".")[1];
    let position = 0;
    for (let digit of afterDecimal) {
      position++;
      if (digit !== "0") break;
    }
    // Show all digits up to and including the first non-zero digit
    return num.toFixed(position);
  }

  // Check if the number has decimal places
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Otherwise, truncate to at most 2 decimal places without rounding
  return (Math.floor(num * 100) / 100).toFixed(2).replace(/\.00$/, "");
}
