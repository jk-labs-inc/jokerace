import { Chain } from "@rainbow-me/rainbowkit";

export const polygon: Chain = {
  id: 137,
  name: "polygon",
  iconUrl: "/polygon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "POL",
    symbol: "POL",
  },
  rpcUrls: {
    public: {
      http: [`https://1rpc.io/matic`],
    },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.matic.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
    default: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
  },
};
