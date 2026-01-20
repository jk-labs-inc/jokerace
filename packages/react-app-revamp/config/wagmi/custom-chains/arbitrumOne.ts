import { ChainWithIcon } from "./types";

export const arbitrumOne: ChainWithIcon = {
  id: 42161,
  name: "arbitrumone",
  iconUrl: "/arbitrum.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [`https://arb1.arbitrum.io/rpc`],
    },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.arbitrum-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
    default: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
  },
};
