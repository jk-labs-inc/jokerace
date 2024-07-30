import { Chain } from "@rainbow-me/rainbowkit";

export const avalanche: Chain = {
  id: 43114,
  name: "avalanche",
  iconUrl: "/avalanche.png",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
    },
    default: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Snowtrace", url: "https://snowtrace.io/" },
    default: { name: "Snowtrace", url: "https://snowtrace.io/" },
  },
};
