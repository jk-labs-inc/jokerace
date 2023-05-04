import { chain, configureChains, createClient } from "wagmi";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { polygonZkMainnet } from "./custom-chains/polygonZkMainnet";
import { sepolia } from "./custom-chains/sepolia";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { scrollGoerli } from "./custom-chains/scrollGoerli";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { evmosMainnet } from "./custom-chains/evmosMainnet";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { connectorsForWallets, getDefaultWallets, wallet } from "@rainbow-me/rainbowkit";

type ChainImages = {
  [key: string]: string;
};

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const testnetChains = [
  chain.polygonMumbai,
  chain.goerli,
  sepolia,
  polygonZkTestnet,
  polygonZkMainnet,
  baseTestnet,
  scrollGoerli,
  evmosTestnet,
  evmosMainnet,
  avaxCChain,
];

const defaultChains = [chain.polygon, chain.arbitrum, chain.mainnet, chain.optimism];
const appChains = [...defaultChains, ...testnetChains];
const providers =
  process.env.NODE_ENV === "development"
    ? [publicProvider(), alchemyProvider({ alchemyId })]
    : [alchemyProvider({ alchemyId }), infuraProvider({ infuraId }), publicProvider()];
export const { chains, provider } = configureChains(appChains, providers);

const { wallets } = getDefaultWallets({
  appName: "JokeDAO",
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
  localhost: "/ethereum.svg",
  goerli: "/ethereum.svg",
  kovan: "/ethereum.svg",
  polygon: "/polygon.svg",
  polygonmumbai: "/polygon.svg",
  polygonzktestnet: "/polygon.svg",
  polygonzkmainnet: "/polygon.svg",
  scrollgoerli: "/scroll.png",
  basetestnet: "/base.svg",
};
