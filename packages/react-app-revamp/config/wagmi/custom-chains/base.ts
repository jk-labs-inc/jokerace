import { Chain } from "@rainbow-me/rainbowkit";

export const base: Chain = {
  id: 8453,
  name: "base",
  iconUrl: "/base.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://base.llamarpc.com`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.base-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Base Mainnet Scan", url: "https://basescan.org/" },
    default: { name: "Base Mainnet Scan", url: "https://basescan.org/" },
  },
};
