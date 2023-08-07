import { Chain } from "@rainbow-me/rainbowkit";

export const evmos: Chain = {
  id: 9001,
  name: "evmos",
  network: "evmos",
  iconUrl: "/evmos.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Evmos",
    symbol: "EVMOS",
  },
  rpcUrls: {
    public: {
      http: ["https://eth.bd.evmos.org:8545"],
    },
    default: {
      http: ["https://eth.bd.evmos.org:8545"],
    },
  },
  blockExplorers: {
    escan: { name: "escan.live", url: "https://escan.live" },
    default: { name: "escan.live", url: "https://escan.live" },
  },
};
