import { Chain } from "@rainbow-me/rainbowkit";

export const luksoTestnet: Chain = {
  id: 4201,
  name: "luksoTestnet",
  network: "luksoTestnet",
  iconUrl: "/lukso.svg",
  nativeCurrency: {
    decimals: 18,
    name: "LYXt",
    symbol: "LYXt",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.lukso.gateway.fm"],
    },
    default: {
      http: ["https://rpc.testnet.lukso.gateway.fm"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lukso Testnet Block Explorer", url: "https://explorer.execution.testnet.lukso.network" },
    default: { name: "Lukso Testnet Block Explorer", url: "https://explorer.execution.testnet.lukso.network" },
  },
};
