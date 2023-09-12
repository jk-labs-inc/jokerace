import { Chain } from "@rainbow-me/rainbowkit";

export const arbitrumOneTestnet: Chain = {
  id: 42161,
  name: "arbitrumoneTestnet",
  network: "arbitrumoneTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://arbitrum-goerli.publicnode.com"],
    },
    default: {
      http: ["https://arbitrum-goerli.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Testnet Etherscan", url: "https://goerli-rollup-explorer.arbitrum.io" },
    default: { name: "Arbitrum Testnet Etherscan", url: "https://goerli-rollup-explorer.arbitrum.io" },
  },
};
