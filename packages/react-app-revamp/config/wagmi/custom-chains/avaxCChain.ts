import { Chain } from "@rainbow-me/rainbowkit";

export const avaxCChain: Chain = {
  id: 43114,
  name: "Avalanche",
  network: "avaxCChain",
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
    escan: { name: "Snowtrace", url: "https://snowtrace.io/" },
    default: { name: "Snowtrace", url: "https://snowtrace.io/" },
  },
};
