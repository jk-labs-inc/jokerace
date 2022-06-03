import { object, string, number, boolean } from "zod";

export interface DataStep2 {
  tokenName: string;
  tokenSymbol: string;
  receivingAddress: string;
  numberOfTokens: number;
  nonTransferable: boolean;
}

export const schema = object({
  tokenName: string()
    .max(30)
    .trim()
    .min(1),
  tokenSymbol: string()
    .max(10)
    .trim()
    .min(1),
  receivingAddress: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(string().regex(/.*\.eth$/)),
  numberOfTokens: number().positive(),
  nonTransferable: boolean().optional(),
});
