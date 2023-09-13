import { Chain } from "@rainbow-me/rainbowkit";

export const base: Chain = {
  id: 8453,
  name: "base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.base.org"] },
    default: { http: [`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Base Mainnet Scan", url: "https://basescan.org" },
    default: { name: "Base Mainnet Scan", url: "https://basescan.org" },
  },
};
