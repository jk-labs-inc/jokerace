import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { argentWallet, imTokenWallet, ledgerWallet, omniWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains, createConfig, mainnet } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { celoTestnet } from "./custom-chains/celoTestnet";
import { degenChain } from "./custom-chains/degenChain";
import { eos } from "./custom-chains/eos";
import { eosTestnet } from "./custom-chains/eosTestnet";
import { evmos } from "./custom-chains/evmos";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { fuse } from "./custom-chains/fuse";
import { gnosis } from "./custom-chains/gnosis";
import { gnosisTestnet } from "./custom-chains/gnosisTestnet";
import { goerli } from "./custom-chains/goerli";
import { linea } from "./custom-chains/linea";
import { lineaTestnet } from "./custom-chains/lineaTestnet";
import { litTestnet } from "./custom-chains/litTestnet";
import { lootChain } from "./custom-chains/lootChain";
import { lootChainTestnet } from "./custom-chains/lootChainTestnet";
import { lukso } from "./custom-chains/lukso";
import { luksoTestnet } from "./custom-chains/luksoTestnet";
import { mantle } from "./custom-chains/mantle";
import { mantleTestnet } from "./custom-chains/mantleTestnet";
import { modeTestnet } from "./custom-chains/modeTestnet";
import { nautilusChain } from "./custom-chains/nautilusChain";
import { near } from "./custom-chains/near";
import { nearTestnet } from "./custom-chains/nearTestnet";
import { optimism } from "./custom-chains/optimism";
import { optimismTestnet } from "./custom-chains/optimismTestnet";
import { polygon } from "./custom-chains/polygon";
import { polygonTestnet } from "./custom-chains/polygonTestnet";
import { polygonZk } from "./custom-chains/polygonZk";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { proteus } from "./custom-chains/proteus";
import { publicGoodsNetwork } from "./custom-chains/publicGoodsNetwork";
import { publicGoodsNetworkTestnet } from "./custom-chains/publicGoodsNetworkTestnet";
import { qChain } from "./custom-chains/qChain";
import { qChainTestnet } from "./custom-chains/qChainTestnet";
import { ronin } from "./custom-chains/ronin";
import { roninTestnet } from "./custom-chains/roninTestnet";
import { scrollSepoliaTestnet } from "./custom-chains/scrollSepoliaTestnet";
import { scrollTestnet } from "./custom-chains/scrollTestnet";
import { sepolia } from "./custom-chains/sepolia";
import { zetaTestnet } from "./custom-chains/zetaTestnet";
import { zora } from "./custom-chains/zora";

type ChainImages = {
  [key: string]: string;
};

const totalChains: Chain[] = [
  polygon,
  arbitrumOne,
  optimism,
  polygonZk,
  base,
  evmos,
  avaxCChain,
  zora,
  bnb,
  linea,
  celo,
  publicGoodsNetwork,
  lootChain,
  near,
  gnosis,
  mantle,
  lukso,
  qChain,
  eos,
  proteus,
  nautilusChain,
  ronin,
  degenChain,
  fuse,
  polygonTestnet,
  sepolia,
  goerli,
  polygonZkTestnet,
  baseTestnet,
  scrollTestnet,
  evmosTestnet,
  lineaTestnet,
  litTestnet,
  zetaTestnet,
  celoTestnet,
  optimismTestnet,
  publicGoodsNetworkTestnet,
  lootChainTestnet,
  nearTestnet,
  gnosisTestnet,
  mantleTestnet,
  luksoTestnet,
  modeTestnet,
  qChainTestnet,
  eosTestnet,
  roninTestnet,
  scrollSepoliaTestnet,
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
  polygontestnet: "/polygon.svg",
  polygonzktestnet: "/polygon.svg",
  polygonzk: "/polygon.svg",
  scrolltestnet: "/scroll.png",
  base: "/base.svg",
  gnosis: "/gnosis.png",
  gnosistestnet: "/gnosis.png",
  publicgoodsnetwork: "/publicgoodsnetwork.svg",
  publicgoodsnetworktestnet: "/publicgoodsnetwork.svg",
  lootchain: "/lootchain.svg",
  lootchaintestnet: "/lootchain.svg",
  celo: "/celo.svg",
  celotestnet: "/celo.svg",
  evmos: "/evmos.svg",
  evmostestnet: "/evmos.svg",
  linea: "/linea.svg",
  lineatestnet: "/linea.svg",
  littestnet: "/lit.svg",
  lukso: "/lukso.svg",
  luksotestnet: "/lukso.svg",
  mantle: "/mantle.svg",
  mantletestnet: "/mantle.svg",
  nautilusChain: "/nautilusChain.png",
  near: "/aurora.svg",
  neartestnet: "/aurora.svg",
  zetatestnet: "/zeta.svg",
  zora: "/zora.png",
  qchain: "/qchain.svg",
  qchaintestnet: "/qchain.svg",
  eos: "/eos.svg",
  eostestnet: "/eos.svg",
  fuse: "/fuse.svg",
};
