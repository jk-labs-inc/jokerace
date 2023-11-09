import { Chain } from "@rainbow-me/rainbowkit";

export const quartz: Chain = {
  id: 8881,
  name: "quartz",
  network: "quartz",
  nativeCurrency: {
    decimals: 18,
    name: "QTZ",
    symbol: "QTZ",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-quartz.unique.network"],
    },
    default: {
      http: ["https://rpc-quartz.unique.network"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Quartz Block Explorer", url: "https://uniquescan.io/quartz/" },
    default: { name: "Quartz Block Explorer", url: "https://uniquescan.io/quartz/" },
  },
};
