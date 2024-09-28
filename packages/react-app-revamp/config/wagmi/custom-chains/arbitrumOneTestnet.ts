import { Chain } from "@rainbow-me/rainbowkit";

export const arbitrumOneTestnet: Chain = {
  id: 42161,
  name: "arbitrumoneTestnet",
  iconUrl: "/arbitrum.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia-rollup.arbitrum.io/rpc"],
    },
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.arbitrum-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Testnet Etherscan", url: "https://sepolia-explorer.arbitrum.io/" },
    default: { name: "Arbitrum Testnet Etherscan", url: "https://sepolia-explorer.arbitrum.io/" },
  },
  testnet: true,
};
