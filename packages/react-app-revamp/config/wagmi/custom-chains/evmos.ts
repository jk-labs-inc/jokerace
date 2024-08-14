import { Chain } from "@rainbow-me/rainbowkit";

export const evmos: Chain = {
  id: 9001,
  name: "evmos",
  iconUrl: "/evmos.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Evmos",
    symbol: "EVMOS",
  },
  rpcUrls: {
    public: {
      http: ["https://evmos.lava.build"],
    },
    default: {
      http: ["https://evmos.lava.build"],
    },
  },
  blockExplorers: {
    etherscan: { name: "escan.live", url: "https://escan.live/" },
    default: { name: "escan.live", url: "https://escan.live/" },
  },
};
