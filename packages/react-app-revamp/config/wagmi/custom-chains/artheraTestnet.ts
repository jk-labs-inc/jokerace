import { Chain } from "@rainbow-me/rainbowkit";

export const artheraTestnet: Chain = {
  id: 10243,
  name: "artheraTestnet",
  network: "artheraTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Arthera",
    symbol: "AA",
  },
  rpcUrls: {
    public: { http: ["https://rpc-test.arthera.net"] },
    default: { http: ["https://rpc-test.arthera.net"] },
  },
  blockExplorers: {
    etherscan: { name: "Arthera Testnet Scan", url: "https://explorer-test.arthera.net" },
    default: { name: "Arthera Testnet Scan", url: "https://explorer-test.arthera.net" },
  },
  testnet: true,
};
