import { object, string, number, boolean } from "zod";

export const schema = object({
  tokenRewardsAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(string().max(0)),
  isErc20: boolean(),
  amount: number().positive(),
});
