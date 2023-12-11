import { LensClient, production } from "@lens-protocol/client";

export const lensClient = new LensClient({
  environment: production
});

export default lensClient;