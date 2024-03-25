import { Chain } from "@rainbow-me/rainbowkit";

export const baseTestnet: Chain = {
  id: 84531,
  name: "baseTestnet",
  iconUrl: "/base.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia.base.org"],
    },
    default: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
    default: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
  },
  testnet: true,
};
