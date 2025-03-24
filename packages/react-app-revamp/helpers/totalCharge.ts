import { formatEther } from "viem";

export const getTotalCharge = (amount: number, costToVote: number) => {
  const chargeAmount = parseFloat(formatEther(BigInt(costToVote)));
  const multipliedCharge = chargeAmount * amount;
  const charge = +multipliedCharge.toFixed(6);
  return charge.toString();
};
