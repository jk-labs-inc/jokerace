import { Chain } from "@rainbow-me/rainbowkit";

export const unique: Chain = {
  id: 8880,
  name: "unique",
  network: "unique",
  iconUrl: "/unique.svg",
  nativeCurrency: {
    decimals: 18,
    name: "UNQ",
    symbol: "UNQ",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.unique.network"],
    },
    default: {
      http: ["https://rpc.unique.network"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Unique Block Explorer", url: "https://uniquescan.io/unique/" },
    default: { name: "Unique Block Explorer", url: "https://uniquescan.io/unique/" },
  },
};
