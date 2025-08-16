import { Chain } from "@rainbow-me/rainbowkit";

export const sei: Chain = {
  id: 1329,
  name: "sei",
  iconUrl: "/sei.png",
  nativeCurrency: {
    decimals: 18,
    name: "Sei",
    symbol: "SEI",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.sei-pacific.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.sei-pacific.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
    default: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
  },
};
