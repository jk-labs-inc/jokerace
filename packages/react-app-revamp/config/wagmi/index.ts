import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { argentWallet, imTokenWallet, ledgerWallet, omniWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains, createConfig, mainnet } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { baseMainnet } from "./custom-chains/baseMainnet";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { bnbMainnet } from "./custom-chains/bnbMainnet";
import { celoMainnet } from "./custom-chains/celoMainnet";
import { celoTestnet } from "./custom-chains/celoTestnet";
import { evmosMainnet } from "./custom-chains/evmosMainnet";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { gnosisMainnet } from "./custom-chains/gnosisMainnet";
import { gnosisTestnet } from "./custom-chains/gnosisTestnet";
import { goerli } from "./custom-chains/goerli";
import { lineaTestnet } from "./custom-chains/lineaTestnet";
import { litTestnet } from "./custom-chains/litTestnet";
import { lootChainMainnet } from "./custom-chains/lootChainMainnet";
import { lootChainTestnet } from "./custom-chains/lootChainTestnet";
import { luksoMainnet } from "./custom-chains/luksoMainnet";
import { luksoTestnet } from "./custom-chains/luksoTestnet";
import { mantleMainnet } from "./custom-chains/mantleMainnet";
import { mantleTestnet } from "./custom-chains/mantleTestnet";
import { nearAuroraMainnet } from "./custom-chains/nearAuroraMainnet";
import { nearAuroraTestnet } from "./custom-chains/nearAuroraTestnet";
import { optimism } from "./custom-chains/optimism";
import { optimismTestnet } from "./custom-chains/optimismTestnet";
import { polygon } from "./custom-chains/polygon";
import { polygonMumbai } from "./custom-chains/polygonMumbai";
import { polygonZkMainnet } from "./custom-chains/polygonZkMainnet";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { publicGoodsNetworkMainnet } from "./custom-chains/publicGoodsNetworkMainnet";
import { publicGoodsNetworkTestnet } from "./custom-chains/publicGoodsNetworkTestnet";
import { scrollGoerli } from "./custom-chains/scrollGoerli";
import { sepolia } from "./custom-chains/sepolia";
import { zetaTestnet } from "./custom-chains/zetaTestnet";
import { zoraMainnet } from "./custom-chains/zora";

type ChainImages = {
  [key: string]: string;
};

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
  baseMainnet,
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
  optimismTestnet,
  celoMainnet,
  publicGoodsNetworkMainnet,
  publicGoodsNetworkTestnet,
  lootChainMainnet,
  lootChainTestnet,
  nearAuroraMainnet,
  nearAuroraTestnet,
  gnosisTestnet,
  gnosisMainnet,
  mantleMainnet,
  mantleTestnet,
  luksoMainnet,
  luksoTestnet,
  mainnet,
];

const publicClients =
  process.env.NEXT_PUBLIC_ALCHEMY_KEY !== "" && process.env.NEXT_PUBLIC_ALCHEMY_KEY
    ? [
        jsonRpcProvider({
          rpc: chain => {
            return {
              http: `${chain.rpcUrls.default.http[0]}`,
            };
          },
        }),
      ]
    : [
        jsonRpcProvider({
          rpc: chain => {
            return {
              http: `${chain.rpcUrls.public.http[0]}`,
            };
          },
        }),
      ];

export const { chains, publicClient, webSocketPublicClient } = configureChains(totalChains, publicClients);

const WALLETCONECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const { wallets } = getDefaultWallets({
  appName: "jokerace",
  chains,
  projectId: WALLETCONECT_PROJECT_ID,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      trustWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      ledgerWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      imTokenWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      omniWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
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
  gnosismainnet: "/gnosis.png",
  gnosistestnet: "/gnosis.png",
  publicgoodsnetworkmainnet: "/publicgoodsnetwork.svg",
  publicgoodsnetworktestnet: "/publicgoodsnetwork.svg",
  lootchainmainnet: "/lootchain.svg",
  lootchaintestnet: "/lootchain.svg",
};
