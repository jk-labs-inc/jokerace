import { Chain } from "@rainbow-me/rainbowkit";

export const fantom: Chain = {
  id: 250,
  name: "fantom",
  network: "fantom",
  iconUrl: "/fantom.svg",
  nativeCurrency: {
    decimals: 18,
    name: "FTM",
    symbol: "FTM",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/fantom/"],
    },
    default: {
      http: ["https://rpc.ankr.com/fantom/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Fantom Block Explorer", url: "https://ftmscan.com/" },
    default: { name: "Fantom Block Explorer", url: "https://ftmscan.com/" },
  },
};
