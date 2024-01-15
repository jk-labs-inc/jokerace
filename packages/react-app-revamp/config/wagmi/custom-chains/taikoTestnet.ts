import { Chain } from "@rainbow-me/rainbowkit";

export const taikoTestnet: Chain = {
  id: 167007,
  name: "taikoTestnet",
  network: "taikoTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.jolnir.taiko.xyz"],
    },
    default: {
      http: ["https://rpc.jolnir.taiko.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Taiko Testnet Scan", url: "https://explorer.jolnir.taiko.xyz" },
    default: { name: "Taiko Testnet Scan", url: "https://explorer.jolnir.taiko.xyz" },
  },
  testnet: true,
};
