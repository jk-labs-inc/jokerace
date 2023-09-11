import { Chain } from "wagmi";

export const optimism: Chain = {
  id: 10,
  name: "optimism",
  network: "optimism",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://optimism.publicnode.com"],
    },
    default: {
      http: ["https://optimism.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Optimism Mainnet Etherscan", url: "https://optimistic.etherscan.io/" },
    default: { name: "Optimism Mainnet Etherscan", url: "https://optimistic.etherscan.io/" },
  },
};
