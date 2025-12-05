import { abstract } from "@config/wagmi/custom-chains/abstract";
import { arbitrumOne } from "@config/wagmi/custom-chains/arbitrumOne";
import { avalanche } from "@config/wagmi/custom-chains/avalanche";
import { base } from "@config/wagmi/custom-chains/base";
import { baseTestnet } from "@config/wagmi/custom-chains/baseTestnet";
import { celo } from "@config/wagmi/custom-chains/celo";
import { cyber } from "@config/wagmi/custom-chains/cyber";
import { forma } from "@config/wagmi/custom-chains/forma";
import { hyperliquid } from "@config/wagmi/custom-chains/hyperliquid";
import { ink } from "@config/wagmi/custom-chains/ink";
import { linea } from "@config/wagmi/custom-chains/linea";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import { manta } from "@config/wagmi/custom-chains/manta";
import { metis } from "@config/wagmi/custom-chains/metis";
import { mode } from "@config/wagmi/custom-chains/mode";
import { monad } from "@config/wagmi/custom-chains/monad";
import { polygon } from "@config/wagmi/custom-chains/polygon";
import { sepolia } from "@config/wagmi/custom-chains/sepolia";
import { soneium } from "@config/wagmi/custom-chains/soneium";
import { sonic } from "@config/wagmi/custom-chains/sonic";
import { story } from "@config/wagmi/custom-chains/story";
import { swell } from "@config/wagmi/custom-chains/swell";
import { world } from "@config/wagmi/custom-chains/world";
import { zksyncEra } from "@config/wagmi/custom-chains/zksyncEra";
import createTransports from "@config/wagmi/transports";
import { Chain } from "@rainbow-me/rainbowkit";
import { cookieStorage, createConfig, createStorage } from "wagmi";

export const chains: readonly [Chain, ...Chain[]] = [
  polygon,
  arbitrumOne,
  base,
  avalanche,
  linea,
  celo,
  mode,
  cyber,
  metis,
  forma,
  soneium,
  story,
  ink,
  swell,
  manta,
  zksyncEra,
  sonic,
  world,
  abstract,
  hyperliquid,
  monad,
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
