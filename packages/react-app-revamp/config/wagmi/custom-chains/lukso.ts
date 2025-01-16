import { Chain } from "@rainbow-me/rainbowkit";

export const lukso: Chain = {
  id: 42,
  name: "lukso",
  iconUrl: "/lukso.svg",
  nativeCurrency: {
    decimals: 18,
    name: "LYX",
    symbol: "LYX",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.mainnet.lukso.network"],
    },
    default: {
      http: ["https://rpc.mainnet.lukso.network"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lukso Mainnet Scan", url: "https://explorer.lukso.network" },
    default: { name: "Lukso Mainnet Scan", url: "https://explorer.lukso.network" },
  },
};
