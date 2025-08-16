import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
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
import { gnosis } from "./custom-chains/gnosis";
import { hyperliquid } from "./custom-chains/hyperliquid";
import { ink } from "./custom-chains/ink";
import { linea } from "./custom-chains/linea";
import { mainnet } from "./custom-chains/mainnet";
import { manta } from "./custom-chains/manta";
import { metis } from "./custom-chains/metis";
import { mode } from "./custom-chains/mode";
import { optimism } from "./custom-chains/optimism";
import { polygon } from "./custom-chains/polygon";
import { scroll } from "./custom-chains/scroll";
import { sei } from "./custom-chains/sei";
import { sepolia } from "./custom-chains/sepolia";
import { soneium } from "./custom-chains/soneium";
import { sonic } from "./custom-chains/sonic";
import { story } from "./custom-chains/story";
import { swell } from "./custom-chains/swell";
import { unichain } from "./custom-chains/unichain";
import { world } from "./custom-chains/world";
import { zksyncEra } from "./custom-chains/zksyncEra";
import { isParaWalletConfigured, paraWallet } from "./para";
import createTransports from "./transports";

declare module "wagmi";

type ChainImages = {
  [key: string]: string;
};

export const chains: readonly [Chain, ...Chain[]] = [
  polygon,
  arbitrumOne,
  optimism,
  base,
  avalanche,
  linea,
  celo,
  gnosis,
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

const WALLETCONECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
const appName = "jokerace";
const projectId = WALLETCONECT_PROJECT_ID;

coinbaseWallet.preference = "smartWalletOnly";

const connectors = connectorsForWallets(
  [
    ...(isParaWalletConfigured
      ? [
          {
            groupName: "Standard Login (Recommended For New Users)",
            wallets: [paraWallet],
          },
        ]
      : []),
    {
      groupName: "Other Wallets",
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
