import { Chain } from "@rainbow-me/rainbowkit";
import { Transport } from "viem";
import { cookieStorage, createConfig, createStorage, fallback, http } from "wagmi";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { avalanche } from "./custom-chains/avalanche";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { berachain } from "./custom-chains/berachain";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { cyber } from "./custom-chains/cyber";
import { forma } from "./custom-chains/forma";
import { gnosis } from "./custom-chains/gnosis";
import { ink } from "./custom-chains/ink";
import { linea } from "./custom-chains/linea";
import { mainnet } from "./custom-chains/mainnet";
import { manta } from "./custom-chains/manta";
import { mantle } from "./custom-chains/mantle";
import { metis } from "./custom-chains/metis";
import { mode } from "./custom-chains/mode";
import { optimism } from "./custom-chains/optimism";
import { polygon } from "./custom-chains/polygon";
import { polygonZk } from "./custom-chains/polygonZk";
import { scroll } from "./custom-chains/scroll";
import { sei } from "./custom-chains/sei";
import { sepolia } from "./custom-chains/sepolia";
import { soneium } from "./custom-chains/soneium";
import { story } from "./custom-chains/story";
import { swell } from "./custom-chains/swell";
import { unichain } from "./custom-chains/unichain";
import { zora } from "./custom-chains/zora";

type Transports = Record<Chain["id"], Transport>;

const isProduction = process.env.NODE_ENV === "production";

export const chains: readonly [Chain, ...Chain[]] = [
  polygon,
  arbitrumOne,
  optimism,
  polygonZk,
  base,
  avalanche,
  zora,
  linea,
  celo,
  gnosis,
  mantle,
  scroll,
  mode,
  sei,
  cyber,
  metis,
  forma,
  bnb,
  soneium,
  story,
  ink,
  berachain,
  unichain,
  swell,
  manta
  sepolia,
  baseTestnet,
  mainnet,
];

const createTransports = (chains: readonly [Chain, ...Chain[]]): Transports => {
  const headers = isProduction ? { Referer: "https://jokerace.io/" } : undefined;

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

const transports = createTransports(chains);

export const serverConfig = createConfig({
  chains,
  transports,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
