import { createClient } from "urql";

const API_URL = (process.env.NEXT_PUBLIC_LENS_API_URL as string) ?? "https://api.lens.dev";

export const client = new createClient({
  url: API_URL,
});

export default client;
