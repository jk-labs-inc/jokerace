export function formatBalance(balance: string): string {
  const num = parseFloat(balance);

  if (num === 0) {
    return "0";
  }

  // handle all non-zero numbers
  if (num !== 0) {
    // truncate to 3 decimal places without rounding
    const truncated = Math.floor(Math.abs(num) * 1000) / 1000;
    // format with up to 3 decimal places, removing trailing zeros
    return (num < 0 ? "-" : "") + truncated.toFixed(3).replace(/\.?0+$/, "");
  }

  return "0";
}
