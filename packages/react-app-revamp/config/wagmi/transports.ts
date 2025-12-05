import { Chain, Transport, fallback, http } from "viem";

type Transports = Record<Chain["id"], Transport>;

const isProduction = import.meta.env?.VITE_APP_ENVIRONMENT === "production";

const getHeaders = () => (isProduction ? { Referer: "https://jokerace.io/" } : { Referer: "" });

export const createTransport = (chain: Chain): Transport => {
  const headers = getHeaders();

  if (chain.rpcUrls?.default?.http?.[0] && chain.rpcUrls?.public?.http?.[0]) {
    return fallback([
      http(chain.rpcUrls.default.http[0], {
        fetchOptions: {
          headers,
        },
      }),
      http(chain.rpcUrls.public.http[0], {
        fetchOptions: {
          headers,
        },
      }),
    ]);
  }

  // Fallback to just the default RPC if public is not available
  if (chain.rpcUrls?.default?.http?.[0]) {
    return http(chain.rpcUrls.default.http[0], {
      fetchOptions: {
        headers,
      },
    });
  }

  throw new Error(`No valid RPC URLs found for chain ${chain.name}`);
};

const createTransports = (chains: readonly [Chain, ...Chain[]]): Transports => {
  return chains.reduce<Transports>((acc, chain) => {
    try {
      acc[chain.id] = createTransport(chain);
    } catch (error) {
      console.warn(`Failed to create transport for chain ${chain.name}:`, error);
    }
    return acc;
  }, {});
};

export default createTransports;
