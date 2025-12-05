import { addressRegex } from "@helpers/regex";
import { z } from "zod";

export const SubmissionParamsSchema = z.object({
  chain: z.string().min(1, "Chain name is required"),
  address: z.string().regex(addressRegex, "Invalid Ethereum address"),
  submission: z.string().min(1, "Submission ID is required"),
});

export type SubmissionParams = z.infer<typeof SubmissionParamsSchema>;
