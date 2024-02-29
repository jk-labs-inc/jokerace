import { Chain } from "@rainbow-me/rainbowkit";

export const modeTestnet: Chain = {
  id: 919,
  name: "modeTestnet",
  iconUrl: "/mode.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia.mode.network/"],
    },
    default: {
      http: ["https://sepolia.mode.network/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mode Testnet Scan", url: "https://sepolia.explorer.mode.network/" },
    default: { name: "Mode Testnet Scan", url: "https://sepolia.explorer.mode.network/" },
  },
  testnet: true,
};
