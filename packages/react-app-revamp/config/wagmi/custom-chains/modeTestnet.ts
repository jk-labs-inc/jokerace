import { Chain } from "@rainbow-me/rainbowkit";

export const modeTestnet: Chain = {
  id: 919,
  name: "modeTestnet",
  network: "modeTestnet",
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
    etherscan: { name: "Mantle Testnet Scan", url: "https://sepolia.explorer.mode.network/" },
    default: { name: "Mantle Testnet Scan", url: "https://sepolia.explorer.mode.network/" },
  },
};
