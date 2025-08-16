import { Chain } from "@rainbow-me/rainbowkit";

export const scroll: Chain = {
  id: 534352,
  name: "scroll",
  iconUrl: "/scroll.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.scroll-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.scroll-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Scroll Block Explorer", url: "https://scrollscan.com/" },
    default: { name: "Scroll Block Explorer", url: "https://scrollscan.com/" },
  },
};
