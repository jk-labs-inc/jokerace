import { Chain } from "wagmi";

export const arbitrumOneTestnet = {
  id: 42161,
  name: "arbitrumoneTestnet",
  network: "arbitrumoneTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://endpoints.omniatech.io/v1/arbitrum/goerli/public"],
    },
    default: {
      http: [`https://arb-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Testnet Etherscan", url: "https://goerli-rollup-explorer.arbitrum.io" },
    default: { name: "Arbitrum Testnet Etherscan", url: "https://goerli-rollup-explorer.arbitrum.io" },
  },
} as const satisfies Chain;
