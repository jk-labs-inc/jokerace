import { Chain } from "@rainbow-me/rainbowkit";

export const berachain: Chain = {
  id: 80094,
  name: "berachain",
  iconUrl: "/berachain.svg",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.bera-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.bera-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Berachain Mainnet Scan", url: "https://berascan.com/" },
    default: { name: "Berachain Mainnet Scan", url: "https://berascan.com/" },
  },
};
