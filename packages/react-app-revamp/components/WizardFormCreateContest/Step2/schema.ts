import { object, string, number, boolean } from "zod";

export interface DataStep2 {
  tokenName: string;
  tokenSymbol: string;
  receivingAddress: string;
  numberOfTokens: number;
  nonTransferable: boolean;
}

export const schema = object({
  tokenName: string({
    required_error: "A token name of maximum 30 characters is required",
    invalid_type_error: "This token name is invalid.",
  })
    .max(30)
    .trim()
    .min(1),
  tokenSymbol: string({
    required_error: "A token symbol of maximum 10 characters is required",
    invalid_type_error: "This token symbol is invalid. Please use a maximum of 10 characters.",
  })
    .max(10)
    .trim()
    .min(1),
  receivingAddress: string({
    required_error: "A valid Ethereum address is required.",
    invalid_type_error: "This Ethereum address is invalid.",
  })
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .or(
      string({
        required_error: "A valid Ethereum address is required",
        invalid_type_error: "This Ethereum address is invalid",
      }).regex(/.*\.eth$/),
    ),
  numberOfTokens: number({
    required_error: "A positive number of token of tokens is required.",
    invalid_type_error: "A positive number of token of tokens is required.",
  }).positive(),
  nonTransferable: boolean().optional(),
});
