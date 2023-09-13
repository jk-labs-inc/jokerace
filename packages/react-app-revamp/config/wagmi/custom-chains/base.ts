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
    public: { http: ["https://base.publicnode.com"] },
    default: { http: ["https://base.publicnode.com"] },
  },
  blockExplorers: {
    etherscan: { name: "Base Mainnet Scan", url: "https://basescan.org" },
    default: { name: "Base Mainnet Scan", url: "https://basescan.org" },
  },
};
