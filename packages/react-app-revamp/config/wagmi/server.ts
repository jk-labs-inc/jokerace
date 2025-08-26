import { Chain } from "@rainbow-me/rainbowkit";
import { Transport } from "viem";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import { abstract } from "./custom-chains/abstract";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { avalanche } from "./custom-chains/avalanche";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { berachain } from "./custom-chains/berachain";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { cyber } from "./custom-chains/cyber";
import { forma } from "./custom-chains/forma";
import { hyperliquid } from "./custom-chains/hyperliquid";
import { ink } from "./custom-chains/ink";
import { linea } from "./custom-chains/linea";
import { mainnet } from "./custom-chains/mainnet";
import { manta } from "./custom-chains/manta";
import { metis } from "./custom-chains/metis";
import { mode } from "./custom-chains/mode";
import { polygon } from "./custom-chains/polygon";
import { scroll } from "./custom-chains/scroll";
import { sei } from "./custom-chains/sei";
import { sepolia } from "./custom-chains/sepolia";
import { soneium } from "./custom-chains/soneium";
import { sonic } from "./custom-chains/sonic";
import { story } from "./custom-chains/story";
import { swell } from "./custom-chains/swell";
import { world } from "./custom-chains/world";
import { zksyncEra } from "./custom-chains/zksyncEra";
import createTransports from "./transports";

export const chains: readonly [Chain, ...Chain[]] = [
  polygon,
  arbitrumOne,
  base,
  avalanche,
  linea,
  celo,
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
  swell,
  manta,
  zksyncEra,
  sonic,
  world,
  abstract,
  hyperliquid,
  sepolia,
  baseTestnet,
  mainnet,
];

const transports = createTransports(chains);

export const serverConfig = createConfig({
  chains,
  transports,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
