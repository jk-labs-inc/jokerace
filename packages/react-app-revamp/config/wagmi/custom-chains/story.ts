import { Chain } from "@rainbow-me/rainbowkit";

export const story: Chain = {
  id: 1514,
  name: "story",
  iconUrl: "/story.svg",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    public: { http: [`https://evm-rpc.story.mainnet.dteam.tech`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.story-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Story Mainnet Scan", url: "https://storyscan.io/" },
    default: { name: "Story Mainnet Scan", url: "https://storyscan.io/" },
  },
};
