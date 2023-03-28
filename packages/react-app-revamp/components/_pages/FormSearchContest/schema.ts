import { object, string } from "zod";

export const schema = object({
  contestTitle: string().min(1),
});
