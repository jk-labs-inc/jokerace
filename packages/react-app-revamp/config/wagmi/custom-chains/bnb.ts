import { Chain } from "@rainbow-me/rainbowkit";

export const bnb: Chain = {
  id: 56,
  name: "bnb",
  iconUrl: "/bnb.png",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.bsc.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.bsc.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "BNB Mainnet Scan", url: "https://bnbscan.org/" },
    default: { name: "BNB Mainnet Scan", url: "https://bnbscan.org/" },
  },
};
