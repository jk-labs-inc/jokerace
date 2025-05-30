import { formatUnits, formatEther } from "viem";

export const transform = (amount: bigint, tokenAddress: string, tokenDecimals: number) => {
  return tokenAddress === "native" ? parseFloat(formatEther(amount)) : parseFloat(formatUnits(amount, tokenDecimals));
};
