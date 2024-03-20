import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  bitgetWallet,
  coinbaseWallet,
  imTokenWallet,
  metaMaskWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { Transport } from "viem";
import { cookieStorage, createConfig, createStorage, fallback, http } from "wagmi";
import { aevo } from "./custom-chains/aevo";
import { ancient8 } from "./custom-chains/ancient8";
import { ancient8Testnet } from "./custom-chains/ancient8Testnet";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { arthera } from "./custom-chains/arthera";
import { artheraTestnet } from "./custom-chains/artheraTestnet";
import { astarZkevm } from "./custom-chains/astarZkevm";
import { astarZkevmTestnet } from "./custom-chains/astarZkevmTestnet";
import { astriaDusk2 } from "./custom-chains/astriaDusk2";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { berachainTestnet } from "./custom-chains/berachainTestnet";
import { blast } from "./custom-chains/blast";
import { blastTestnet } from "./custom-chains/blastTestnet";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { celoTestnet } from "./custom-chains/celoTestnet";
import { degenChain } from "./custom-chains/degenChain";
import { eos } from "./custom-chains/eos";
import { eosTestnet } from "./custom-chains/eosTestnet";
import { evmos } from "./custom-chains/evmos";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { fantom } from "./custom-chains/fantom";
import { fantomTestnet } from "./custom-chains/fantomTestnet";
import { frameTestnet } from "./custom-chains/frameTestnet";
import { fraxtal } from "./custom-chains/fraxtal";
import { fraxtalTestnet } from "./custom-chains/fraxtalTestnet";
import { fuse } from "./custom-chains/fuse";
import { gnosis } from "./custom-chains/gnosis";
import { gnosisTestnet } from "./custom-chains/gnosisTestnet";
import { goerli } from "./custom-chains/goerli";
import { holesky } from "./custom-chains/holesky";
import { inEvm } from "./custom-chains/inEvm";
import { inEvmTestnet } from "./custom-chains/inEvmTestnet";
import { kroma } from "./custom-chains/kroma";
import { linea } from "./custom-chains/linea";
import { lineaTestnet } from "./custom-chains/lineaTestnet";
import { litTestnet } from "./custom-chains/litTestnet";
import { lootChain } from "./custom-chains/lootChain";
import { lootChainTestnet } from "./custom-chains/lootChainTestnet";
import { lukso } from "./custom-chains/lukso";
import { luksoTestnet } from "./custom-chains/luksoTestnet";
import { lyra } from "./custom-chains/lyra";
import { mainnet } from "./custom-chains/mainnet";
import { mantaPacific } from "./custom-chains/mantaPacific";
import { mantle } from "./custom-chains/mantle";
import { mantleTestnet } from "./custom-chains/mantleTestnet";
import { merlin } from "./custom-chains/merlin";
import { merlinTestnet } from "./custom-chains/merlinTestnet";
import { mode } from "./custom-chains/mode";
import { modeTestnet } from "./custom-chains/modeTestnet";
import { morphTestnet } from "./custom-chains/morphTestnet";
import { nautilusChain } from "./custom-chains/nautilusChain";
import { near } from "./custom-chains/near";
import { nearTestnet } from "./custom-chains/nearTestnet";
import { neonDevnet } from "./custom-chains/neonDevnet";
import { optimism } from "./custom-chains/optimism";
import { optimismTestnet } from "./custom-chains/optimismTestnet";
import { palm } from "./custom-chains/palm";
import { palmTestnet } from "./custom-chains/palmTestnet";
import { polygon } from "./custom-chains/polygon";
import { polygonTestnet } from "./custom-chains/polygonTestnet";
import { polygonZk } from "./custom-chains/polygonZk";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { proteus } from "./custom-chains/proteus";
import { qChain } from "./custom-chains/qChain";
import { qChainTestnet } from "./custom-chains/qChainTestnet";
import { quartz } from "./custom-chains/quartz";
import { redstoneHolesky } from "./custom-chains/redstoneHolesky";
import { ronin } from "./custom-chains/ronin";
import { roninTestnet } from "./custom-chains/roninTestnet";
import { scroll } from "./custom-chains/scroll";
import { scrollSepoliaTestnet } from "./custom-chains/scrollSepoliaTestnet";
import { scrollTestnet } from "./custom-chains/scrollTestnet";
import { sei } from "./custom-chains/sei";
import { sepolia } from "./custom-chains/sepolia";
import { syndicateFrame } from "./custom-chains/syndicateFrame";
import { taikoTestnet } from "./custom-chains/taikoTestnet";
import { unique } from "./custom-chains/unique";
import { vitruveo } from "./custom-chains/vitruveo";
import { x1Testnet } from "./custom-chains/x1Testnet";
import { zetaTestnet } from "./custom-chains/zetaTestnet";
import { zkFair } from "./custom-chains/zkFair";
import { zkFairTestnet } from "./custom-chains/zkFairTestnet";
import { zora } from "./custom-chains/zora";

type ChainImages = {
  [key: string]: string;
};

type Transports = Record<Chain["id"], Transport>;

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const chains: readonly [Chain, ...Chain[]] = [
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
  kroma,
  scroll,
  quartz,
  unique,
  vitruveo,
  mantaPacific,
  holesky,
  redstoneHolesky,
  mode,
  astriaDusk2,
  fantom,
  arthera,
  palm,
  lyra,
  fraxtal,
  aevo,
  sei,
  syndicateFrame,
  ancient8,
  blast,
  astarZkevm,
  merlin,
  zkFair,
  inEvm,
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
  artheraTestnet,
  x1Testnet,
  neonDevnet,
  frameTestnet,
  fantomTestnet,
  berachainTestnet,
  taikoTestnet,
  palmTestnet,
  fraxtalTestnet,
  morphTestnet,
  blastTestnet,
  ancient8Testnet,
  astarZkevmTestnet,
  merlinTestnet,
  zkFairTestnet,
  inEvmTestnet,
  mainnet,
];

const WALLETCONECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const appName = "jokerace";
const projectId = WALLETCONECT_PROJECT_ID;

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
        tahoWallet,
        argentWallet,
        trustWallet,
        imTokenWallet,
        omniWallet,
        bitgetWallet,
        rabbyWallet,
        phantomWallet,
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
