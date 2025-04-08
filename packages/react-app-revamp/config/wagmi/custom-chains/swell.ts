import { Chain } from "@rainbow-me/rainbowkit";

export const swell: Chain = {
  id: 1923,
  name: "swell",
  iconUrl: "/swell.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [ "https://swell-mainnet.alt.technology/" ],
    },
    default: {
      http: [ "https://swell-mainnet.alt.technology/" ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Swell Mainnet Scan", url: "https://explorer.swellnetwork.io/" },
    default: { name: "Swell Mainnet Scan", url: "https://explorer.swellnetwork.io/" },
  },
};
