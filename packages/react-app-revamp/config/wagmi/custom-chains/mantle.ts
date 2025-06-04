import { Chain } from "@rainbow-me/rainbowkit";

export const mantle: Chain = {
  id: 5000,
  name: "mantle",
  iconUrl: "/mantle.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.mantle-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.mantle-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz/" },
    default: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz/" },
  },
};
