import { chain, configureChains, createClient } from "wagmi";
import { fantom, avalanche, harmony, gnosis } from "@helpers/chains";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets, getDefaultWallets, wallet } from "@rainbow-me/rainbowkit";

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
const appChains = process.env.NODE_ENV === "development" ? [...defaultChains, ...testnetChains] : defaultChains;

export const { chains, provider } = configureChains(appChains, [publicProvider()]);

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
