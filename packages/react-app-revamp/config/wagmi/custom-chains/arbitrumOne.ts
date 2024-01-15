import { Chain } from "@rainbow-me/rainbowkit";

export const arbitrumOne: Chain = {
  id: 42161,
  name: "arbitrumone",
  network: "arbitrumone",
  iconUrl: "/arbitrum.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/arbitrum"],
    },
    default: {
      http: [`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
    default: { name: "Arbitrum Mainnet Etherscan", url: "https://arbiscan.io/" },
  },
};
