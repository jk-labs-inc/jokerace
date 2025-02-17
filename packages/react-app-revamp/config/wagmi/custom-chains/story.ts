import { Chain } from "@rainbow-me/rainbowkit";

export const story: Chain = {
  id: 1514,
  name: "story",
  iconUrl: "/story.png",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.storyrpc.io"],
    },
    default: {
      http: ["https://mainnet.storyrpc.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Story Mainnet Scan", url: "https://storyscan.xyz/" },
    default: { name: "Story Mainnet Scan", url: "https://storyscan.xyz/" },
  },
};
