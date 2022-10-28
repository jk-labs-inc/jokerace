import { object, string, number } from "zod";

export const schema = object({
  tokenRewardsAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(string().max(0)),
  amount: number().positive(),
});
