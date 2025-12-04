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
    public: { http: [`https://evm-rpc.story.mainnet.dteam.tech`] },
    default: {
      http: [
        `https://${import.meta.env.VITE_QUICKNODE_SLUG}.story-mainnet.quiknode.pro/${import.meta.env.VITE_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Story Mainnet Scan", url: "https://storyscan.io/" },
    default: { name: "Story Mainnet Scan", url: "https://storyscan.io/" },
  },
};
