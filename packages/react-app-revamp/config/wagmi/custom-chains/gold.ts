import { Chain } from "@rainbow-me/rainbowkit";

export const gold: Chain = {
  id: 4653,
  name: "gold",
  iconUrl: "/gold.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://chain-rpc.gold.dev"],
    },
    default: {
      http: ["https://chain-rpc.gold.dev"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Gold Mainnet Etherscan", url: "https://gold.dev" },
    default: { name: "Gold Mainnet Etherscan", url: "https://gold.dev" },
  },
};
