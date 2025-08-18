import { Chain } from "@rainbow-me/rainbowkit";

export const world: Chain = {
  id: 480,
  name: "world",
  iconUrl: "/world.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.worldchain-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.worldchain-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
    default: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
  },
};
