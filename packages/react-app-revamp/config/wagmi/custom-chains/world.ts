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
    public: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] },
    default: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] },
  },
  blockExplorers: {
    etherscan: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
    default: { name: "World Mainnet Scan", url: "https://worldscan.org/" },
  },
};
