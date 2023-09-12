import { Chain } from "@rainbow-me/rainbowkit";

export const arbitrumOne: Chain = {
  id: 42161,
  name: "arbitrumone",
  network: "arbitrumone",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://arbitrum-one.publicnode.com"],
    },
    default: {
      http: ["https://arbitrum-one.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
    default: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
  },
};
