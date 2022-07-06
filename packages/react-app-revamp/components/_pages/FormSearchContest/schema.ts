import { object, string } from "zod";

export const schema = object({
  contestAddress: string().regex(/^0x[a-fA-F0-9]{40}$/),
});
