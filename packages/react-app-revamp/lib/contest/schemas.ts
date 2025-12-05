import { addressRegex } from "@helpers/regex";
import { z } from "zod";

export const ContestParamsSchema = z.object({
  chain: z.string().min(1, "Chain name is required"),
  address: z.string().regex(addressRegex, "Invalid Ethereum address"),
});

export type ContestParams = z.infer<typeof ContestParamsSchema>;
