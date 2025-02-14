import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { getParaWallet } from "@getpara/rainbowkit-wallet";
import { Environment, OAuthMethod } from "@getpara/react-sdk";

import {
  argentWallet,
  bitgetWallet,
  braveWallet,
  coinbaseWallet,
  frameWallet,
  imTokenWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  omniWallet,
  oneInchWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Transport } from "viem";
import { cookieStorage, createConfig, createStorage, fallback, http } from "wagmi";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { avalanche } from "./custom-chains/avalanche";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { cyber } from "./custom-chains/cyber";
import { forma } from "./custom-chains/forma";
import { gnosis } from "./custom-chains/gnosis";
import { linea } from "./custom-chains/linea";
import { mainnet } from "./custom-chains/mainnet";
import { mantle } from "./custom-chains/mantle";
import { metis } from "./custom-chains/metis";
import { mode } from "./custom-chains/mode";
import { optimism } from "./custom-chains/optimism";
import { polygon } from "./custom-chains/polygon";
import { polygonZk } from "./custom-chains/polygonZk";
import { scroll } from "./custom-chains/scroll";
import { sei } from "./custom-chains/sei";
import { soneium } from "./custom-chains/soneium";
import { sepolia } from "./custom-chains/sepolia";
import { zora } from "./custom-chains/zora";
import { lukso } from "./custom-chains/lukso";

declare module "wagmi";

type ChainImages = {
  [key: string]: string;
};

type Transports = Record<Chain["id"], Transport>;

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
  lukso,
  soneium,
  sepolia,
  baseTestnet,
  mainnet,
];

const PARA_API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY as string;

console.log("PARA_API_KEY", PARA_API_KEY);
const PARA_ENVIRONMENT = process.env.NODE_ENV === "development" ? Environment.BETA : Environment.BETA;

const paraWalletOptions = {
  para: {
    apiKey: PARA_API_KEY,
    environment: PARA_ENVIRONMENT,
  },
  appName: "jokerace",
  oAuthMethods: [OAuthMethod.GOOGLE, OAuthMethod.TWITTER, OAuthMethod.DISCORD],
};

// Create Para wallet connector
const paraWallet = getParaWallet(paraWalletOptions);

console.log("paraWallet", paraWallet);

const WALLETCONECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const appName = "jokerace";
const projectId = WALLETCONECT_PROJECT_ID;

coinbaseWallet.preference = "smartWalletOnly";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Wallets",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
        okxWallet,
        uniswapWallet,
        safeWallet,
        rabbyWallet,
        tahoWallet,
        argentWallet,
        trustWallet,
        imTokenWallet,
        omniWallet,
        phantomWallet,
        bitgetWallet,
        oneInchWallet,
        braveWallet,
        frameWallet,
        zerionWallet,
        ledgerWallet,
      ],
    },
  ],
  {
    projectId: projectId,
    appName: appName,
  },
);

const createTransports = (chains: readonly [Chain, ...Chain[]]): Transports => {
  return chains.reduce<Transports>((acc, chain) => {
    if (chain.rpcUrls?.default?.http?.[0] && chain.rpcUrls?.public?.http?.[0]) {
      acc[chain.id] = fallback([http(chain.rpcUrls.default.http[0]), http(chain.rpcUrls.public.http[0])]);
    }
    return acc;
  }, {});
};

const transports = createTransports(chains);

export const config = createConfig({
  connectors,
  chains,
  transports,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const chainsImages: ChainImages = chains.reduce((acc: any, chain: any) => {
  if (chain.name && chain.iconUrl) {
    acc[chain.name.toLowerCase()] = chain.iconUrl as string;
  }
  return acc;
}, {} as ChainImages);
