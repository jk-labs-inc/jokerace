import { object, number } from "zod";

export const schema = object({
  votesToCast: number().positive(),
});
