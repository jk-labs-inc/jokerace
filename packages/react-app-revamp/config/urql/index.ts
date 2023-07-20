import { createClient } from "urql";

const API_URL = "https://api.lens.dev";

//@ts-ignore
export const client = new createClient({
  url: API_URL,
});

export default client;
