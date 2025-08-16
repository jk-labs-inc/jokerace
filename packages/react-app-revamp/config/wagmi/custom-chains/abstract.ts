import { Chain } from "@rainbow-me/rainbowkit";

export const abstract: Chain = {
  id: 2741,
  name: "abstract",
  iconUrl: "/abstract.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.abstract-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.abstract-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Abstract Mainnet Scan", url: "https://abscan.org/" },
    default: { name: "Abstract Mainnet Scan", url: "https://abscan.org/" },
  },
};
