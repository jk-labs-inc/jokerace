import { Chain } from "wagmi";

export const sepolia = {
  id: 11155111,
  name: "sepolia",
  network: "sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.sepolia.org/"],
    },
    default: {
      http: ["https://rpc.sepolia.org/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io" },
    default: { name: "Sepolia Otterscan", url: "https://sepolia.otterscan.io" },
  },
} as const satisfies Chain;
