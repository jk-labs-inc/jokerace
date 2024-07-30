import { Chain } from "@rainbow-me/rainbowkit";

export const sanko: Chain = {
  id: 1996,
  name: "sanko",
  iconUrl: "/sanko.png",
  nativeCurrency: {
    decimals: 18,
    name: "DMT",
    symbol: "DMT",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.sanko.xyz"],
    },
    default: {
      http: ["https://mainnet.sanko.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sanko Scan", url: "https://explorer.sanko.xyz/" },
    default: { name: "Sanko Scan", url: "https://explorer.sanko.xyz/" },
  },
};
