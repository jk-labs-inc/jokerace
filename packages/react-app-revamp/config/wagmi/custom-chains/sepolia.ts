import { Chain } from "wagmi";

export const sepolia: Chain = {
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
      http: ["https://gateway.tenderly.co/public/sepolia"],
    },
    default: {
      http: ["https://gateway.tenderly.co/public/sepolia"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan" },
    default: { name: "Sepolia Otterscan", url: "https://sepolia.otterscan" },
  },
};
