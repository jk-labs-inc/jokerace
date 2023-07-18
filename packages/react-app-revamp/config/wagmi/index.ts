import { Chain, configureChains, createClient } from "wagmi";
import { polygon } from "./custom-chains/polygon";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { optimism } from "./custom-chains/optimism";
import { polygonMumbai } from "./custom-chains/polygonMumbai";
import { goerli } from "./custom-chains/goerli";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { polygonZkMainnet } from "./custom-chains/polygonZkMainnet";
import { sepolia } from "./custom-chains/sepolia";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { scrollGoerli } from "./custom-chains/scrollGoerli";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { evmosMainnet } from "./custom-chains/evmosMainnet";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { zoraMainnet } from "./custom-chains/zora";
import { bnbMainnet } from "./custom-chains/bnbMainnet";
import { lineaTestnet } from "./custom-chains/lineaTestnet";
import { litTestnet } from "./custom-chains/litTestnet";
import { zetaTestnet } from "./custom-chains/zetaTestnet";
import { celoTestnet } from "./custom-chains/celoTestnet";
import { celoMainnet } from "./custom-chains/celoMainnet";
import { publicGoodsNetworkMainnet } from "./custom-chains/publicGoodsNetworkMainnet";
import { publicGoodsNetworkTestnet } from "./custom-chains/publicGoodsNetworkTestnet";
import { lootChainMainnet } from "./custom-chains/lootChainMainnet";
import { lootChainTestnet } from "./custom-chains/lootChainTestnet";
import { nearAuroraMainnet } from "./custom-chains/nearAuroraMainnet";
import { nearAuroraTestnet } from "./custom-chains/nearAuroraTestnet";
import { gnosisMainnet } from "./custom-chains/gnosisMainnet";
import { gnosisTestnet } from "./custom-chains/gnosisTestnet";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { connectorsForWallets, getDefaultWallets, wallet } from "@rainbow-me/rainbowkit";

type ChainImages = {
  [key: string]: string;
};

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const totalChains: Chain[] = [
  polygon,
  arbitrumOne,
  optimism,
  polygonMumbai,
  sepolia,
  goerli,
  polygonZkTestnet,
  polygonZkMainnet,
  baseTestnet,
  scrollGoerli,
  evmosTestnet,
  evmosMainnet,
  avaxCChain,
  zoraMainnet,
  bnbMainnet,
  lineaTestnet,
  litTestnet,
  zetaTestnet,
  celoTestnet,
  celoMainnet,
  publicGoodsNetworkMainnet,
  publicGoodsNetworkTestnet,
  lootChainMainnet,
  lootChainTestnet,
  nearAuroraMainnet,
  nearAuroraTestnet,
  gnosisTestnet,
  gnosisMainnet,
];

const providers =
  process.env.NODE_ENV === "development"
    ? [publicProvider(), alchemyProvider({ alchemyId })]  // if in dev, try public first in case there isn't an Alchemy key
    : [alchemyProvider({ alchemyId }), publicProvider()];
export const { chains, provider } = configureChains(totalChains, providers);

const { wallets } = getDefaultWallets({
  appName: "jokerace",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.steak({ chains }),
      wallet.imToken({ chains }),
      wallet.ledger({ chains }),
    ],
  },
]);

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const chainsImages: ChainImages = {
  avalanche: "/avalanche.png",
  fantom: "/fantom.png",
  gnosis: "/gnosis.png",
  harmony: "/harmony.png",
  arbitrum: "/arbitrum.svg",
  arbitrumone: "/arbitrum.svg",
  arbitrumrinkeby: "/arbitrum.svg",
  optimismkovan: "/optimism.svg",
  optimism: "/optimism.svg",
  ethereum: "/ethereum.svg",
  hardhat: "/hardhat.svg",
  rinkeby: "/ethereum.svg",
  ropsten: "/ethereum.svg",
  sepolia: "/ethereum.svg",
  localhost: "/ethereum.svg",
  goerli: "/ethereum.svg",
  kovan: "/ethereum.svg",
  polygon: "/polygon.svg",
  polygonmumbai: "/polygon.svg",
  polygonzktestnet: "/polygon.svg",
  polygonzkmainnet: "/polygon.svg",
  scrollgoerli: "/scroll.png",
  basetestnet: "/base.svg",
  gnosistestnet: "/gnosis.png"
};
