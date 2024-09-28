import { Chain } from "@rainbow-me/rainbowkit";

export const optimismTestnet: Chain = {
  id: 420,
  name: "optimismTestnet",
  iconUrl: "/optimism.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://optimism-sepolia.publicnode.com"],
    },
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.optimism-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Optimism Testnet Etherscan", url: "https://sepolia-optimism.etherscan.io/" },
    default: { name: "Optimism Testnet Etherscan", url: "https://sepolia-optimism.etherscan.io/" },
  },
  testnet: true,
};
