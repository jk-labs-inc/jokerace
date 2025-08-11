export const getTotalCharge = (amount: number, costToVote: string) => {
  const chargeAmount = parseFloat(costToVote);
  const multipliedCharge = chargeAmount * amount;
  const charge = +multipliedCharge.toFixed(6);
  return charge.toString();
};
