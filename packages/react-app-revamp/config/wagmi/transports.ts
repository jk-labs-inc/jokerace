import { Chain, Transport, fallback, http } from "viem";

type Transports = Record<Chain["id"], Transport>;

const isProduction = process.env.NODE_ENV === "production";

const createTransports = (chains: readonly [Chain, ...Chain[]]): Transports => {
  const headers = isProduction ? { Referer: "https://jokerace.io/" } : { Referer: "" };

  return chains.reduce<Transports>((acc, chain) => {
    if (chain.rpcUrls?.default?.http?.[0] && chain.rpcUrls?.public?.http?.[0]) {
      acc[chain.id] = fallback([
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
    return acc;
  }, {});
};

export default createTransports;
