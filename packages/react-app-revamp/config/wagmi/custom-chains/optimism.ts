import { Chain } from "@rainbow-me/rainbowkit";

export const optimism: Chain = {
  id: 10,
  name: "optimism",
  network: "optimism",
  iconUrl: "/optimism.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/optimism"],
    },
    default: {
      http: [`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Optimism Mainnet Etherscan", url: "https://optimistic.etherscan.io/" },
    default: { name: "Optimism Mainnet Etherscan", url: "https://optimistic.etherscan.io/" },
  },
};
