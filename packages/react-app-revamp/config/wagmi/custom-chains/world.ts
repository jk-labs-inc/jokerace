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
    public: { http: [`https://worldchain-mainnet.g.alchemy.com/public`] },
    default: {
      http: [
        `https://${import.meta.env.VITE_QUICKNODE_SLUG}.worldchain-mainnet.quiknode.pro/${import.meta.env.VITE_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
    default: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
  },
};
