import { chain, configureChains, createClient } from "wagmi";
import { fantom, avalanche, harmony, gnosis } from "@helpers/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { connectorsForWallets, getDefaultWallets, wallet } from "@rainbow-me/rainbowkit";

const infuraId = process.env.INFURA_ID;
const alchemyId = process.env.ALCHEMY_KEY;

const testnetChains = [
  chain.polygonMumbai,
  chain.rinkeby,
  chain.ropsten,
  chain.goerli,
  chain.arbitrumRinkeby,
  chain.optimismKovan,
];

const defaultChains = [
  chain.polygon,
  chain.arbitrum,
  chain.mainnet,
  chain.optimism,
  fantom,
  avalanche,
  harmony,
  gnosis,
  chain.localhost,
];
const customProvider = jsonRpcProvider({
  priority: 0,
  rpc: (chain) => {
    let ankrSuffixUrl;
    switch(chain.name) {
      case "Ethereum": 
        ankrSuffixUrl = 'eth'
      break
      default:
        ankrSuffixUrl = chain.name.toLowerCase()
      break
    }
    console.log("ankrSuffixUrl:", ankrSuffixUrl);
    return ({
      http: `https://rpc.ankr.com/${ankrSuffixUrl}`,
      });
  }
});
console.log(customProvider)
const appChains = [...defaultChains, ...testnetChains];
const providers =
  process.env.NODE_ENV === "development"
    ? [customProvider, publicProvider()]
    : [customProvider, alchemyProvider({ alchemyId }), infuraProvider({ infuraId }), publicProvider()];
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

export const chainsImages = {
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
};
